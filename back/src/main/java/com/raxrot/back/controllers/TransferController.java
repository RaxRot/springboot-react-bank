package com.raxrot.back.controllers;

import com.raxrot.back.models.ExternalTransferRequest;
import com.raxrot.back.models.InternalTransferRequest;
import com.raxrot.back.services.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping("/internal")
    public ResponseEntity<Map<String, Object>> internal(@Valid @RequestBody InternalTransferRequest req) {
        Map<String, Object> result = transferService.transferInternal(
                req.getFromAccountId(), req.getToAccountId(), req.getAmount(), req.getMemo());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/external")
    public ResponseEntity<Map<String, Object>> external(@Valid @RequestBody ExternalTransferRequest req) {
        Map<String, Object> result = transferService.transferExternal(
                req.getFromAccountId(), req.getToAccountId(), req.getAmount(), req.getMemo());
        return ResponseEntity.ok(result);
    }
}