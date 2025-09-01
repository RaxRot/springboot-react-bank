package com.raxrot.back.services;

import com.stripe.exception.StripeException;

import java.util.Map;

public interface PaymentVerifyService {
     Map<String, Object> verifyAndCredit(String sessionId) throws StripeException;
}
