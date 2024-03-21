package com.starter.api.messages.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
class MessageRequest(
    @NotBlank(message = "Full name must not be blank")
    val fullName: String,
    @NotBlank(message = "Message must not be blank")
    val message: String,
    @NotBlank(message = "Email must not be blank")
    @Email(regexp = ".+[@].+[\\.].+")
    val email: String,
)
