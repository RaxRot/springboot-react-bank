package com.raxrot.back.services;

import com.raxrot.back.dtos.AccountRequest;
import com.raxrot.back.dtos.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(AccountRequest accountRequest);
    List<AccountResponse> getAllAccounts();
    AccountResponse getAccount(Long accountId);
    void deleteAccount(Long accountId);
}
