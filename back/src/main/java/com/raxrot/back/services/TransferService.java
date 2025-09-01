package com.raxrot.back.services;

import java.math.BigDecimal;
import java.util.Map;

public interface TransferService {
    Map<String, Object> transferInternal(Long fromAccountId, Long toAccountId, BigDecimal amount, String memo);
    Map<String, Object> transferExternal(Long fromAccountId, Long toAccountId, BigDecimal amount, String memo);
}