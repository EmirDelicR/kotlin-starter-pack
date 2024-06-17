package com.starter.api.rest.users.dtos

import com.starter.api.rest.roles.core.Role
import com.starter.api.rest.subscriptions.core.Subscription
import java.time.OffsetDateTime

data class UserResponse(
    val id: String,
    val email: String,
    val role: Role?,
    val age: Int?,
    val avatar: String?,
    val firstName: String,
    val lastName: String,
    val userName: String,
    val loggedIn: Boolean,
    val profileUpdated: Boolean,
    val subscribed: Boolean,
    val subscriptions: Set<Subscription>?,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime,
)
