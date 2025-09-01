package com.raxrot.back.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tbl_topup_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopUpLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String sessionId;

    @Column(nullable=false)
    private Long accountId;

    @Column(nullable=false, precision=19, scale=2)
    private BigDecimal amountPaid;

    @Column(nullable=false, length=3)
    private String paidCurrency;

    @Column(nullable=false, precision=19, scale=2)
    private BigDecimal amountCredited;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=8)
    private CurrencyType creditedCurrency;

    private OffsetDateTime processedAt;
}
