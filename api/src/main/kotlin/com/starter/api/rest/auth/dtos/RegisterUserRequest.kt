package com.starter.api.rest.auth.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

@JsonIgnoreProperties(ignoreUnknown = true)
data class RegisterUserRequest(
    @field:Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@\$!%*#?&])[A-Za-z\\d@\$!%*#?&]{8,}\$",
        message = "Password is not strong enough!(min 8 char | number | special char)",
    )
    val password: String,
    @field:Email(regexp = ".+[@].+[\\.].+", message = "Email is not valid!")
    val email: String,
    @field:NotBlank(message = "First name must not be blank!")
    val firstName: String,
    @field:NotBlank(message = "Last name must not be blank!")
    val lastName: String,
    val userName: String,
)
