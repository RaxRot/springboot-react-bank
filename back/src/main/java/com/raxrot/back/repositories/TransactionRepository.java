package com.raxrot.back.repositories;

import com.raxrot.back.models.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByInitiatorUserId(Long userId, Pageable pageable);
    Page<Transaction> findByFromAccountIdOrToAccountId(Long fromId, Long toId, Pageable pageable);
}
