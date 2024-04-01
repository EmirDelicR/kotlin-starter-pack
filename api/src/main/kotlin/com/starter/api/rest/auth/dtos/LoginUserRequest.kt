package com.starter.api.rest.auth.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@JsonIgnoreProperties(ignoreUnknown = true)
data class LoginUserRequest (
    @field:Email(regexp = ".+[@].+[\\.].+", message = "Email is not valid!")
    val email: String,
    @field:NotBlank(message = "Password must not be blank!")
    val password: String,
)