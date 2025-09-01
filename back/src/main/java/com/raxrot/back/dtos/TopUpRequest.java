package com.raxrot.back.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopUpRequest {
    @NotNull
    private Long accountId;
    @NotNull
    @Min(100)
    private Long amount;
    @NotBlank
    private String currency;
    @NotBlank
    private String successUrl;
    @NotBlank
    private String cancelUrl;
}
