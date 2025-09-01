package com.raxrot.back.services.impl;

import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.CurrencyType;
import com.raxrot.back.services.FxService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
@Service
public class FxServiceFrankfurter implements FxService {
    private final RestTemplate rest = new RestTemplate();

    @Override
    public BigDecimal convert(BigDecimal amount, String from, CurrencyType to) {
        String fromCur = from.toUpperCase();
        String toCur = to.name();

        // If the same -return
        if (fromCur.equals(toCur)) {
            return amount.setScale(2, RoundingMode.HALF_UP);
        }

        String url = "https://api.frankfurter.app/latest?amount={amount}&from={from}&to={to}";
        Map<String, String> vars = Map.of(
                "amount", amount.toPlainString(),
                "from", fromCur,
                "to", toCur
        );

        try {
            Map<?, ?> resp = rest.getForObject(url, Map.class, vars);
            if (resp == null || !resp.containsKey("rates")) {
                throw new ApiException("FX service error", HttpStatus.BAD_GATEWAY);
            }
            Map<String, Object> rates = (Map<String, Object>) resp.get("rates");
            Object val = rates.get(toCur);
            if (val == null) {
                throw new ApiException("FX rate not found for " + fromCur + "→" + toCur, HttpStatus.BAD_GATEWAY);
            }
            return new BigDecimal(val.toString()).setScale(2, RoundingMode.HALF_UP);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Frankfurter 422 "bad currency pair" или другие 4xx
            String msg = e.getResponseBodyAsString();
            throw new ApiException("FX error: " + msg, HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            throw new ApiException("FX unexpected error: " + e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }
}