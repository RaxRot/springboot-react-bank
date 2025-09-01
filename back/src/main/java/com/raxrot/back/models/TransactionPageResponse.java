package com.raxrot.back.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransactionPageResponse {
    private List<TransactionResponse> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Integer totalPages;
    private Long totalElements;
    private boolean lastPage;
}