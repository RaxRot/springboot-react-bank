package com.raxrot.back.services;

import com.raxrot.back.dtos.AccountRequest;
import com.raxrot.back.dtos.AccountResponse;

public interface AccountService {
    AccountResponse createAccount(AccountRequest accountRequest);
}
