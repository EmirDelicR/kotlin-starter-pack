package com.starter.api.rest.users.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

@JsonIgnoreProperties(ignoreUnknown = true)
data class UserUpdateRequest(
    @field:Min(value = 1L, message = "Age must be positive number!")
    val age: Int,
    val avatar: String,
    @field:NotBlank(message = "First name must not be blank!")
    val firstName: String,
    @field:NotBlank(message = "Last name must not be blank!")
    val lastName: String,
    val userName: String,
    val subscribed: Boolean,
    val subscriptions: Array<SubscriptionType>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as UserUpdateRequest

        return subscriptions.contentEquals(other.subscriptions)
    }

    override fun hashCode(): Int {
        return subscriptions.contentHashCode()
    }
}