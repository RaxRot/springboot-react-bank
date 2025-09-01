package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.StripeResponse;
import com.raxrot.back.dtos.TopUpRequest;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Account;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.AccountRepository;
import com.raxrot.back.services.StripeTopUpService;
import com.raxrot.back.utils.AuthUtil;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class StripeTopUpServiceImpl implements StripeTopUpService {
    private final AuthUtil authUtil;
    private final AccountRepository accountRepository;

    public StripeResponse createTopUpSession(TopUpRequest req) {
        User me = authUtil.loggedInUser();

        Account acc = accountRepository.findById(req.getAccountId())
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));

        if (!acc.getUser().getUserId().equals(me.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        if (req.getAmount() < 100) {
            throw new ApiException("Minimum amount is 1.00", HttpStatus.BAD_REQUEST);
        }

        try {
            String currency = req.getCurrency().toLowerCase();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(req.getSuccessUrl() + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(req.getCancelUrl())
                    .putMetadata("type", "topup")
                    .putMetadata("accountId", String.valueOf(acc.getId()))
                    .putMetadata("accountCurrency", acc.getCurrencyType().name())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency(currency)
                                                    .setUnitAmount(req.getAmount()) // в минимальных единицах
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Top-up account #" + acc.getId())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            return new StripeResponse(
                    "success",
                    "Checkout session created",
                    session.getId(),
                    session.getUrl()
            );
        } catch (Exception e) {
            return new StripeResponse("error", e.getMessage(), null, null);
        }
    }
}
