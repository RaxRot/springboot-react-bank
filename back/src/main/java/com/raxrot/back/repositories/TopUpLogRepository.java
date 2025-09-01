package com.raxrot.back.repositories;

import com.raxrot.back.models.TopUpLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopUpLogRepository extends JpaRepository<TopUpLog, Long> {
    boolean existsBySessionId(String sessionId);
}
