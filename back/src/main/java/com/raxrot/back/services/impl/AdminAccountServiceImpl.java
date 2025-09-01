package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.AccountPageResponse;
import com.raxrot.back.dtos.AccountResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Account;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.services.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAccountServiceImpl implements AdminAccountService {
    private final ModelMapper modelMapper;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public AccountPageResponse getAllAccounts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Account> accounts = accountRepository.findAll(pageDetails);

        List<AccountResponse> content = accounts.getContent().stream()
                .map(acc -> {
                    AccountResponse dto = modelMapper.map(acc, AccountResponse.class);
                    dto.setOwnerUsername(acc.getUser().getUserName());
                    dto.setOwnerEmail(acc.getUser().getEmail());
                    return dto;
                })
                .toList();

        AccountPageResponse resp = new AccountPageResponse();
        resp.setContent(content);
        resp.setPageNumber(accounts.getNumber());
        resp.setPageSize(accounts.getSize());
        resp.setTotalElements(accounts.getTotalElements());
        resp.setTotalPages(accounts.getTotalPages());
        resp.setLastPage(accounts.isLast());
        return resp;
    }

    @Override
    public List<AccountResponse> getAllUserAccounts(Long userId) {
        User user=userRepository.findById(userId)
                .orElseThrow(()-> new ApiException("User not found", HttpStatus.NOT_FOUND));
        List<Account>accounts=accountRepository.findByUser_UserId(userId);
        List<AccountResponse> accountResponses = accounts.stream()
                .map(acc -> {
                    AccountResponse dto = modelMapper.map(acc, AccountResponse.class);
                    dto.setOwnerUsername(acc.getUser().getUserName());
                    dto.setOwnerEmail(acc.getUser().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
        return accountResponses;
    }

    @Override
    public AccountResponse getAccount(Long id) {
        Account account=accountRepository.findById(id)
                .orElseThrow(()->new ApiException("Account not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(account, AccountResponse.class);
    }

    @Override
    public void deleteAccount(Long id) {
        Account account=accountRepository.findById(id)
                .orElseThrow(()->new ApiException("Account not found", HttpStatus.NOT_FOUND));
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new ApiException("Cannot delete account with non-zero balance", HttpStatus.BAD_REQUEST);
        }
        accountRepository.delete(account);
    }
}
