package com.raxrot.back.services.impl;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.*;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.repositories.TransactionRepository;
import com.raxrot.back.services.StatementService;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatementServiceImpl implements StatementService {

    private final AuthUtil authUtil;
    private final AccountRepository accountRepository;
    private final TransactionRepository txRepo;

    @Override
    public TransactionPageResponse myTransactions(Integer page, Integer size, String sortBy, String sortDir) {
        User me = authUtil.loggedInUser();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Transaction> p = txRepo.findByInitiatorUserId(me.getUserId(), pageable);
        return toPageDto(p);
    }

    @Override
    public TransactionPageResponse accountTransactions(Long accountId, Integer page, Integer size, String sortBy, String sortDir) {
        User me = authUtil.loggedInUser();

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));

        boolean isOwner = acc.getUser().getUserId().equals(me.getUserId());
        boolean isAdmin = me.getRoles().stream().anyMatch(r -> r.getRoleName() == AppRole.ROLE_ADMIN);
        if (!isOwner && !isAdmin) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Transaction> p = txRepo.findByFromAccountIdOrToAccountId(accountId, accountId, pageable);
        return toPageDto(p);
    }

    private TransactionPageResponse toPageDto(Page<Transaction> p) {
        List<TransactionResponse> content = p.getContent().stream().map(this::mapTx).toList();
        TransactionPageResponse resp = new TransactionPageResponse();
        resp.setContent(content);
        resp.setPageNumber(p.getNumber());
        resp.setPageSize(p.getSize());
        resp.setTotalElements(p.getTotalElements());
        resp.setTotalPages(p.getTotalPages());
        resp.setLastPage(p.isLast());
        return resp;
    }

    private TransactionResponse mapTx(Transaction t) {
        TransactionResponse dto = new TransactionResponse();
        dto.setId(t.getId());
        dto.setType(t.getType().name());
        dto.setStatus(t.getStatus().name());
        dto.setFromAccountId(t.getFromAccountId());
        dto.setToAccountId(t.getToAccountId());
        dto.setAmountFrom(t.getAmountFrom());
        dto.setCurrencyFrom(t.getCurrencyFrom() != null ? t.getCurrencyFrom().name() : null);
        dto.setAmountTo(t.getAmountTo());
        dto.setCurrencyTo(t.getCurrencyTo() != null ? t.getCurrencyTo().name() : null);
        dto.setFxRate(t.getFxRate());
        dto.setExternalRef(t.getExternalRef());
        dto.setDescription(t.getDescription());
        dto.setCreatedAt(t.getCreatedAt() != null ? t.getCreatedAt().toString() : null);
        return dto;
    }
}