package com.starter.api.rest.subscriptions.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import jakarta.validation.constraints.NotBlank

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
data class SubscriptionRequest(
    @field:NotBlank(message = "Name must not be blank!")
    val name: String,
)