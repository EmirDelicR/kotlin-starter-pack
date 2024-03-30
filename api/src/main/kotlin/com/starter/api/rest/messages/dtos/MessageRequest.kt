package com.starter.api.rest.messages.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@JsonIgnoreProperties(ignoreUnknown = true)
data class MessageRequest(
    @field:NotBlank(message = "Full name must not be blank!")
    val fullName: String,
    @field:NotBlank(message = "Message must not be blank!")
    val message: String,
    @field:Email(regexp = ".+[@].+[\\.].+", message = "Email is not valid!")
    val email: String,
)
