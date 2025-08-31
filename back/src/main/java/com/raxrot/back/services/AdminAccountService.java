package com.raxrot.back.services;

import com.raxrot.back.dtos.AccountPageResponse;
import com.raxrot.back.dtos.AccountResponse;

import java.util.List;

public interface AdminAccountService {
    AccountPageResponse getAllAccounts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    List<AccountResponse> getAllUserAccounts(Long userId);
    AccountResponse getAccount(Long id);
    void deleteAccount(Long id);
}
