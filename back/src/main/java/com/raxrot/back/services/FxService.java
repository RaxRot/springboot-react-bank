package com.raxrot.back.services;

import com.raxrot.back.models.CurrencyType;

import java.math.BigDecimal;

public interface FxService {
    BigDecimal convert(BigDecimal amount, String fromCurrency, CurrencyType toCurrency);
}
