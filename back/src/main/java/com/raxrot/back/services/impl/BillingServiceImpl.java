package com.raxrot.back.services.impl;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.*;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.repositories.RoleRepository;
import com.raxrot.back.repositories.TransactionRepository;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.services.BillingService;
import com.raxrot.back.services.FxService;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final AuthUtil authUtil;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FxService fxService;
    private final TransactionRepository txRepo;

    @Transactional
    @Override
    public Map<String, Object> purchaseSuperUser(Long accountId) {
        User me = authUtil.loggedInUser();
        if (me == null) {
            throw new ApiException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        boolean alreadySuper = me.getRoles().stream()
                .anyMatch(r -> r.getRoleName() == AppRole.ROLE_SUPER_USER);
        if (alreadySuper) {
            throw new ApiException("Already SUPER_USER", HttpStatus.CONFLICT);
        }

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));
        if (!acc.getUser().getUserId().equals(me.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        BigDecimal priceEur = new BigDecimal("20.00");
        BigDecimal debit = fxService.convert(priceEur, "EUR", acc.getCurrencyType()); // scale 2
        if (acc.getBalance().compareTo(debit) < 0) {
            throw new ApiException("Insufficient funds", HttpStatus.BAD_REQUEST);
        }


        acc.setBalance(acc.getBalance().subtract(debit));
        accountRepository.save(acc);


        Role superRole = roleRepository.findByRoleName(AppRole.ROLE_SUPER_USER)
                .orElseThrow(() -> new ApiException("ROLE_SUPER_USER not configured", HttpStatus.INTERNAL_SERVER_ERROR));
        me.getRoles().add(superRole);
        userRepository.save(me);


        Transaction tx = new Transaction();
        tx.setInitiatorUserId(me.getUserId());
        tx.setFromAccountId(acc.getId());
        tx.setToAccountId(null);
        tx.setType(TransactionType.PURCHASE_SUPER);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setAmountFrom(debit);
        tx.setCurrencyFrom(acc.getCurrencyType());
        tx.setAmountTo(null);
        tx.setCurrencyTo(null);
        tx.setFxRate(debit.divide(priceEur, 8, RoundingMode.HALF_UP));
        tx.setExternalRef(null);
        tx.setDescription("Purchase SUPER_USER (20 EUR)");
        txRepo.save(tx);

        return Map.of(
                "message", "SUPER_USER activated",
                "debited", debit,
                "currency", acc.getCurrencyType().name()
        );
    }
}