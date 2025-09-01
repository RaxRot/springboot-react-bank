package com.raxrot.back.services;

import com.raxrot.back.models.TransactionPageResponse;

public interface StatementService {
    TransactionPageResponse myTransactions(Integer page, Integer size, String sortBy, String sortDir);
    TransactionPageResponse accountTransactions(Long accountId, Integer page, Integer size, String sortBy, String sortDir);
}