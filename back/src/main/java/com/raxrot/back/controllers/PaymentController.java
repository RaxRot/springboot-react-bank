package com.raxrot.back.controllers;

import com.raxrot.back.dtos.StripeResponse;
import com.raxrot.back.dtos.TopUpRequest;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.services.PaymentVerifyService;
import com.raxrot.back.services.StripeTopUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StripeTopUpService stripeTopUpService;
    private final PaymentVerifyService paymentVerifyService;

    @PostMapping("/topup")
    public ResponseEntity<Map<String, Object>> createTopUp(@Valid @RequestBody TopUpRequest req) {
        StripeResponse resp = stripeTopUpService.createTopUpSession(req);
        if (!"success".equals(resp.status())) {
            throw new ApiException(resp.message(), HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(Map.of(
                "sessionId", resp.sessionId(),
                "checkoutUrl", resp.url()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestParam("session_id") String sessionId) throws Exception {
        Map<String, Object> result = paymentVerifyService.verifyAndCredit(sessionId);
        return ResponseEntity.ok(result);
    }
}
