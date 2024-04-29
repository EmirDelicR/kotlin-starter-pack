package com.starter.api.rest.auth.dtos

import com.starter.api.rest.users.core.User

data class AuthResponse(
    val token: String,
    val user: User,
)
