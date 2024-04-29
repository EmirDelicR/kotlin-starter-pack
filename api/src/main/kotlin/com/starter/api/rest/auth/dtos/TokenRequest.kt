package com.starter.api.rest.auth.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank

@JsonIgnoreProperties(ignoreUnknown = true)
data class TokenRequest(
    @field:NotBlank(message = "Token must not be blank!")
    val token: String,
)
