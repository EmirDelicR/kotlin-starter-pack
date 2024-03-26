package com.starter.api.testUtils

import com.starter.api.rest.messages.core.Message
import com.starter.api.rest.messages.dtos.MessageRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

fun sampleMessage(): Message {
    return Message(
        message = "Some message text",
        email = "john@doe.com",
        sender = "John Doe",
        unread = false,
        id = "message-uuid",
    )
}

fun sampleMessageRequest(): MessageRequest {
    return MessageRequest(
        message = "Some message text",
        email = "john@doe.com",
        fullName = "John Doe",
    )
}

fun <T> createPageObject(
    list: List<T>,
    pageSize: Int = 10,
): Page<T> {
    val pageable: Pageable = PageRequest.of(0, pageSize)
    return PageImpl(list, pageable, list.size.toLong())
}
