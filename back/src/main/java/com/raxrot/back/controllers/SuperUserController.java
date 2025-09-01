package com.raxrot.back.controllers;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.PurchaseSuperRequest;
import com.raxrot.back.services.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/billing/super-user")
@RequiredArgsConstructor
public class SuperUserController {
    private final BillingService billingService;

    @PostMapping("/purchase")
    public ResponseEntity<Map<String, Object>> purchase(
            @Valid @RequestBody PurchaseSuperRequest req,
            Authentication authentication) {

        if (req.getAccountId() == null) {
            throw new ApiException("accountId is required", HttpStatus.BAD_REQUEST);
        }

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        Map<String, Object> result = billingService.purchaseSuperUser(req.getAccountId());
        return ResponseEntity.ok(result);
    }
}