package com.raxrot.back.services;

import com.raxrot.back.dtos.StripeResponse;
import com.raxrot.back.dtos.TopUpRequest;

public interface StripeTopUpService {
    StripeResponse createTopUpSession(TopUpRequest req);
}
