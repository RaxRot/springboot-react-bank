package com.raxrot.back.services.impl;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.*;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.repositories.TransactionRepository;
import com.raxrot.back.services.FxService;
import com.raxrot.back.services.TransferService;
import com.raxrot.back.utils.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransferServiceImpl implements TransferService {

    private final AuthUtil authUtil;
    private final AccountRepository accountRepository;
    private final TransactionRepository txRepo;
    private final FxService fxService;

    @Transactional
    @Override
    public Map<String, Object> transferInternal(Long fromAccountId, Long toAccountId, BigDecimal amount, String memo) {
        User me = authUtil.loggedInUser();
        if (fromAccountId.equals(toAccountId)) {
            throw new ApiException("Cannot transfer to the same account", HttpStatus.BAD_REQUEST);
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Amount must be positive", HttpStatus.BAD_REQUEST);
        }

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new ApiException("From account not found", HttpStatus.NOT_FOUND));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new ApiException("To account not found", HttpStatus.NOT_FOUND));

        if (!from.getUser().getUserId().equals(me.getUserId()) || !to.getUser().getUserId().equals(me.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        BigDecimal amountFrom = amount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal amountTo;
        BigDecimal fxRate;
        if (from.getCurrencyType() == to.getCurrencyType()) {
            amountTo = amountFrom;
            fxRate = BigDecimal.ONE.setScale(8, RoundingMode.HALF_UP);
        } else {
            amountTo = fxService.convert(amountFrom, from.getCurrencyType().name(), to.getCurrencyType());
            fxRate = amountTo.divide(amountFrom, 8, RoundingMode.HALF_UP);
        }

        if (from.getBalance().compareTo(amountFrom) < 0) {
            throw new ApiException("Insufficient funds", HttpStatus.BAD_REQUEST);
        }

        from.setBalance(from.getBalance().subtract(amountFrom));
        to.setBalance(to.getBalance().add(amountTo));
        accountRepository.save(from);
        accountRepository.save(to);

        Transaction tx = new Transaction();
        tx.setInitiatorUserId(me.getUserId());
        tx.setFromAccountId(from.getId());
        tx.setToAccountId(to.getId());
        tx.setType(TransactionType.TRANSFER_INTERNAL);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setAmountFrom(amountFrom);
        tx.setCurrencyFrom(from.getCurrencyType());
        tx.setAmountTo(amountTo);
        tx.setCurrencyTo(to.getCurrencyType());
        tx.setFxRate(fxRate);
        tx.setExternalRef(null);
        tx.setDescription(memo != null ? memo : "Internal transfer");
        txRepo.save(tx);

        return Map.of(
                "status", "ok",
                "txId", tx.getId(),
                "debited", amountFrom,
                "debitedCurrency", from.getCurrencyType().name(),
                "credited", amountTo,
                "creditedCurrency", to.getCurrencyType().name()
        );
    }

    @Transactional
    @Override
    public Map<String, Object> transferExternal(Long fromAccountId, Long toAccountId, BigDecimal amount, String memo) {
        User me = authUtil.loggedInUser();
        if (fromAccountId.equals(toAccountId)) {
            throw new ApiException("Cannot transfer to the same account", HttpStatus.BAD_REQUEST);
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Amount must be positive", HttpStatus.BAD_REQUEST);
        }

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new ApiException("From account not found", HttpStatus.NOT_FOUND));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new ApiException("To account not found", HttpStatus.NOT_FOUND));

        if (!from.getUser().getUserId().equals(me.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        if (to.getUser().getUserId().equals(me.getUserId())) {
            throw new ApiException("Use internal transfer for your own accounts", HttpStatus.BAD_REQUEST);
        }

        BigDecimal amountFrom = amount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal amountTo;
        BigDecimal fxRate;
        if (from.getCurrencyType() == to.getCurrencyType()) {
            amountTo = amountFrom;
            fxRate = BigDecimal.ONE.setScale(8, RoundingMode.HALF_UP);
        } else {
            amountTo = fxService.convert(amountFrom, from.getCurrencyType().name(), to.getCurrencyType());
            fxRate = amountTo.divide(amountFrom, 8, RoundingMode.HALF_UP);
        }

        if (from.getBalance().compareTo(amountFrom) < 0) {
            throw new ApiException("Insufficient funds", HttpStatus.BAD_REQUEST);
        }

        from.setBalance(from.getBalance().subtract(amountFrom));
        to.setBalance(to.getBalance().add(amountTo));
        accountRepository.save(from);
        accountRepository.save(to);

        Transaction tx = new Transaction();
        tx.setInitiatorUserId(me.getUserId());
        tx.setFromAccountId(from.getId());
        tx.setToAccountId(to.getId());
        tx.setType(TransactionType.TRANSFER_EXTERNAL);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setAmountFrom(amountFrom);
        tx.setCurrencyFrom(from.getCurrencyType());
        tx.setAmountTo(amountTo);
        tx.setCurrencyTo(to.getCurrencyType());
        tx.setFxRate(fxRate);
        tx.setExternalRef(null);
        tx.setDescription(memo != null ? memo : "External transfer");
        txRepo.save(tx);

        return Map.of(
                "status", "ok",
                "txId", tx.getId(),
                "debited", amountFrom,
                "debitedCurrency", from.getCurrencyType().name(),
                "credited", amountTo,
                "creditedCurrency", to.getCurrencyType().name()
        );
    }
}