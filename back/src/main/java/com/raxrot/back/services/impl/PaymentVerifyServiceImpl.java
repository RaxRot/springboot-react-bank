package com.raxrot.back.services.impl;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Account;
import com.raxrot.back.models.TopUpLog;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.repositories.TopUpLogRepository;
import com.raxrot.back.services.FxService;
import com.raxrot.back.services.PaymentVerifyService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentVerifyServiceImpl implements PaymentVerifyService {
    private final AccountRepository accountRepository;
    private final TopUpLogRepository topUpLogRepository;
    private final FxService fxService;

    // сервер проверяет у Stripe статус оплаты и зачисляет
    public Map<String, Object> verifyAndCredit(String sessionId) throws StripeException {
        Session s = Session.retrieve(sessionId);

        if (!"paid".equalsIgnoreCase(s.getPaymentStatus())) {
            throw new ApiException("Payment not completed", HttpStatus.BAD_REQUEST);
        }
        if (topUpLogRepository.existsBySessionId(sessionId)) {
            return Map.of("message", "Already processed");
        }

        //take what put to metadata
        Long accountId = Long.valueOf(s.getMetadata().get("accountId"));
        String accountCurrency = s.getMetadata().get("accountCurrency"); // exmple "EUR"

        Long amountTotal = s.getAmountTotal(); // в центах
        if (amountTotal == null) amountTotal = s.getAmountSubtotal();
        String paidCurrency = s.getCurrency().toUpperCase();

        BigDecimal paid = new BigDecimal(amountTotal).divide(new BigDecimal(100));

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));


        BigDecimal credited = fxService.convert(paid, paidCurrency, acc.getCurrencyType());

        acc.setBalance(acc.getBalance().add(credited));
        accountRepository.save(acc);

        topUpLogRepository.save(new TopUpLog(
                null, sessionId, acc.getId(), paid, paidCurrency,
                credited, acc.getCurrencyType(), OffsetDateTime.now()
        ));

        return Map.of(
                "message", "Credited",
                "paid", paid,
                "paidCurrency", paidCurrency,
                "credited", credited,
                "accountCurrency", acc.getCurrencyType().name()
        );
    }
}
