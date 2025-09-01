package com.raxrot.back.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "tbl_transactions",
        indexes = {
                @Index(name = "idx_tx_user", columnList = "initiator_user_id"),
                @Index(name = "idx_tx_from_acc", columnList = "from_account_id"),
                @Index(name = "idx_tx_to_acc", columnList = "to_account_id"),
                @Index(name = "idx_tx_created_at", columnList = "created_at")
        }
)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "initiator_user_id", nullable = false)
    private Long initiatorUserId;

    @Column(name = "from_account_id")
    private Long fromAccountId;

    @Column(name = "to_account_id")
    private Long toAccountId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TransactionStatus status;

    @Column(name = "amount_from", precision = 19, scale = 2)
    private BigDecimal amountFrom;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency_from", length = 8)
    private CurrencyType currencyFrom;

    @Column(name = "amount_to", precision = 19, scale = 2)
    private BigDecimal amountTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency_to", length = 8)
    private CurrencyType currencyTo;

    @Column(name = "fx_rate", precision = 18, scale = 8)
    private BigDecimal fxRate; // amountTo / amountFrom

    @Column(name = "external_ref", length = 128)
    private String externalRef; //Stripe session_id

    @Column(length = 256)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}