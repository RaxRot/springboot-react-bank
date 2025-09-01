package com.raxrot.back.dtos;

public record StripeResponse(String status, String message, String sessionId, String url) {}