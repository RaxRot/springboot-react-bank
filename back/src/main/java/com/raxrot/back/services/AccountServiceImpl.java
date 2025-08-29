package com.raxrot.back.services;

import com.raxrot.back.dtos.AccountRequest;
import com.raxrot.back.dtos.AccountResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Account;
import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.CurrencyType;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Override
    public AccountResponse createAccount(AccountRequest accountRequest) {
        User me=authUtil.loggedInUser();
        long accounts = accountRepository.countByUser_UserId(me.getUserId());
        boolean isSuper = me.getRoles().stream()
                .anyMatch(r -> r.getRoleName() == AppRole.ROLE_SUPER_USER
                        || r.getRoleName() == AppRole.ROLE_ADMIN);

        if (!isSuper && accounts >= 1) {
            throw new ApiException("Regular users can only have 1 account", HttpStatus.BAD_REQUEST);
        }

        Account account=modelMapper.map(accountRequest, Account.class);
        account.setIban(generateIban(accountRequest));
        account.setUser(me);
        account.setBalance(BigDecimal.ZERO);
        account.setSwiftCode("RAXBANK");
        Account savedAccount=accountRepository.save(account);
        return modelMapper.map(savedAccount, AccountResponse.class);
    }

    private String generateIban(AccountRequest accountRequest) {
        String countryCode = getCountryCode(accountRequest.getCurrencyType());
        String control = String.format("%02d", new Random().nextInt(100));
        String bankCode = "RAXR";
        String accountPart = UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        return countryCode + control + bankCode + accountPart;
    }

    private String getCountryCode(CurrencyType currency) {
        return switch (currency) {
            case EUR -> "PT";
            case USD -> "US";
            case GBP -> "GB";
            case JPY -> "JP";
            case CHF -> "CH";
            case CAD -> "CA";
            case AUD -> "AU";
            case PLN -> "PL";
            default -> "XX";
        };
    }
}
