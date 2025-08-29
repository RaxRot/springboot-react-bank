package com.raxrot.back.repositories;

import com.raxrot.back.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    long countByUser_UserId(Long userId);
}
