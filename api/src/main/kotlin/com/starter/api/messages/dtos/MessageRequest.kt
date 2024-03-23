package com.starter.api.messages.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
data class MessageRequest(
    @field:NotBlank(message = "Full name must not be blank!")
    val fullName: String,
    @field:NotBlank(message = "Message must not be blank!")
    val message: String,
    @field:NotBlank(message = "Email must not be blank!")
    @field:Email(regexp = ".+[@].+[\\.].+", message = "Email is not valid!")
    val email: String,
)
