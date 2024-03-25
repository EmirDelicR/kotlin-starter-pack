package com.starter.api.testUtils

import com.starter.api.rest.messages.core.Message
import com.starter.api.rest.messages.dtos.MessageRequest

fun sampleMessage(): Message {
    return Message(
        message = "Some message text",
        email = "john@doe.com",
        sender = "John Doe",
        unread = false,
        id = "message-uuid"
    )
}

fun sampleMessageRequest(): MessageRequest {
    return MessageRequest(
        message = "Some message text",
        email = "john@doe.com",
        fullName = "John Doe",
    )
}