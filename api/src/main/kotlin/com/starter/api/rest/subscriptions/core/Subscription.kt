package com.starter.api.rest.subscriptions.core

import com.starter.api.rest.subscriptions.dtos.SubscriptionResponse
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "subscription")
class Subscription(
    @Id
    @Column(name = "id")
    val id: String = UUID.randomUUID().toString(),
    @Column(name = "name", unique = true)
    @Enumerated(EnumType.STRING)
    val name: SubscriptionType = SubscriptionType.NEWS,
) {
    @CreationTimestamp
    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now()

    fun toResponse(): SubscriptionResponse {
        return SubscriptionResponse(
            id,
            name,
            createdAt,
        )
    }
}
