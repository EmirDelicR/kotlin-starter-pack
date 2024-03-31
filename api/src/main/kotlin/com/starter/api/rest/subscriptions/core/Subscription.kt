package com.starter.api.rest.subscriptions.core

import com.starter.api.rest.subscriptions.dtos.SubscriptionResponse
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.rest.users.core.User
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
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
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    val name: SubscriptionType = SubscriptionType.NEWS,
    @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH])
    @JoinTable(
        name = "user_subscription",
        joinColumns = [JoinColumn(name = "subscription_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")],
    )
    val subscriptions: Set<User>? = null,
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
