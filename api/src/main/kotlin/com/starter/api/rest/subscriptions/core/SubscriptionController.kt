package com.starter.api.rest.subscriptions.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.subscriptions.dtos.SubscriptionRequest
import com.starter.api.rest.subscriptions.dtos.SubscriptionResponse
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/subscriptions"])
class SubscriptionController(val subscriptionService: SubscriptionService) {
    private val logger = logger()

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    fun getSubscriptions(): ResponseEnvelope<List<Subscription>> {
        logger.info("Handling getSubscriptions Request")
        val subscriptions = subscriptionService.findAll()

        return ResponseEnvelope(
            data = subscriptions,
            message = "Fetch subscriptions successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun saveSubscription(
        @Valid @RequestBody subscriptionRequest: SubscriptionRequest,
    ): ResponseEnvelope<SubscriptionResponse> {
        logger.info("Handling saveSubscription Request")
        val subscription: Subscription = subscriptionService.create(subscriptionRequest)

        return ResponseEnvelope(
            data = subscription.toResponse(),
            message = "Subscription was created successful.",
            status = HttpStatus.CREATED.value(),
        )
    }
}