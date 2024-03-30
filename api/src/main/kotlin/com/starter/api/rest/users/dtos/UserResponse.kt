package com.starter.api.rest.users.dtos

import com.fasterxml.jackson.annotation.JsonInclude
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import java.time.OffsetDateTime

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class UserResponse(
    val id: String,
    val email: String,
    val role: String,
    val age: Int,
    val avatar: String,
    val firstName: String,
    val lastName: String,
    val userName: String,
    val token: String,
    val loggedIn: Boolean,
    val profileUpdated: Boolean,
    val subscribed: Boolean,
    val subscriptions: Array<SubscriptionType>,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as UserResponse

        return subscriptions.contentEquals(other.subscriptions)
    }

    override fun hashCode(): Int {
        return subscriptions.contentHashCode()
    }
}
