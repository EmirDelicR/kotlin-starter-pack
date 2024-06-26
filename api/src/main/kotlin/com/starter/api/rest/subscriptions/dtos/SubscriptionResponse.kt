package com.starter.api.rest.subscriptions.dtos

import com.fasterxml.jackson.annotation.JsonInclude
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import java.time.OffsetDateTime

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class SubscriptionResponse(
    val id: String,
    val name: SubscriptionType,
    val createdAt: OffsetDateTime,
)
