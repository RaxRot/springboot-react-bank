package com.raxrot.back.dtos;

import com.raxrot.back.models.CurrencyType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
    @NotNull(message = "Currency is required")
    private CurrencyType currencyType;
}
