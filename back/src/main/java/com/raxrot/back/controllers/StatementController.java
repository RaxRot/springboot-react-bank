package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.models.TransactionPageResponse;
import com.raxrot.back.services.StatementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statement")
@RequiredArgsConstructor
public class StatementController {

    private final StatementService statementService;

    @GetMapping("/my")
    public ResponseEntity<TransactionPageResponse> my(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = AppConstants.SORT_CREATED_AT) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortDir
    ) {
        return ResponseEntity.ok(statementService.myTransactions(page, size, sortBy, sortDir));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<TransactionPageResponse> account(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = AppConstants.SORT_CREATED_AT) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortDir
    ) {
        return ResponseEntity.ok(statementService.accountTransactions(accountId, page, size, sortBy, sortDir));
    }
}
