package com.raxrot.back.models;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseSuperRequest {
    @NotNull
    private Long accountId;
}
