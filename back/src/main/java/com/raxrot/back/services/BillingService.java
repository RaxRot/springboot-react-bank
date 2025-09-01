package com.raxrot.back.services;

import java.util.Map;

public interface BillingService {
    Map<String, Object> purchaseSuperUser(Long accountId);
}
