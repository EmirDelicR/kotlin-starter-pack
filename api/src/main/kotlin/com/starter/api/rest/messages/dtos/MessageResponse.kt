package com.starter.api.rest.messages.dtos

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.OffsetDateTime

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class MessageResponse(
    val id: String,
    val sender: String,
    val email: String,
    val unread: Boolean,
    val message: String,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime,
)
