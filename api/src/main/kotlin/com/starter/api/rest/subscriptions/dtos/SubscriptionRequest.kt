package com.starter.api.rest.subscriptions.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.starter.api.rest.subscriptions.enums.SubscriptionType

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
data class SubscriptionRequest(
    val name: SubscriptionType,
)