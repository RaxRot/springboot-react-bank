package com.raxrot.back.models;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionResponse {
    private Long id;
    private String type;
    private String status;
    private Long fromAccountId;
    private Long toAccountId;
    private BigDecimal amountFrom;
    private String currencyFrom;
    private BigDecimal amountTo;
    private String currencyTo;
    private BigDecimal fxRate;
    private String externalRef;
    private String description;
    private String createdAt;
}