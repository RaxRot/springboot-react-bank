package com.raxrot.back.dtos;

import com.raxrot.back.models.CurrencyType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse{
    private CurrencyType currencyType;
    private BigDecimal balance;
    private String iban;
    private String swiftCode;
}
