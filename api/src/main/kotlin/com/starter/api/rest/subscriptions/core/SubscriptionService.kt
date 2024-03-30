package com.starter.api.rest.subscriptions.core

import com.starter.api.rest.subscriptions.dtos.SubscriptionRequest
import org.springframework.stereotype.Service

@Service
class SubscriptionService(val subscriptionRepository: SubscriptionRepository) {
    fun findAll(): List<Subscription> {
        return subscriptionRepository.findAll()
    }

    fun create(subscriptionRequest: SubscriptionRequest): Subscription {
        val subscription =
            Subscription(
                name = subscriptionRequest.name,
            )

        return subscriptionRepository.saveAndFlush(subscription)
    }
}
