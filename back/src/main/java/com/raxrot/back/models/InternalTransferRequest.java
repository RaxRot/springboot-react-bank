package com.raxrot.back.models;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class InternalTransferRequest {
    @NotNull private Long fromAccountId;
    @NotNull private Long toAccountId;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;
    private String memo;
}
