package com.starter.api.messages.core

import com.starter.api.messages.dtos.MessageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class MessageService(val messageRepository: MessageRepository) {
    fun getById(id: String): Message? = messageRepository.findByIdOrNull(id)

    fun create(messageRequest: MessageRequest): Message {
        val message = Message(
            message = messageRequest.message,
            email = messageRequest.email,
            sender = messageRequest.fullName,
            unread = false
        )

        return messageRepository.saveAndFlush(message)
    }

    fun remove(id: String) {
         // TODO @ed make here custom exceptions
        if (!messageRepository.existsById(id)) {
            throw  ResponseStatusException(404 , "Message with $id was not found!" , null)
        }

        messageRepository.deleteById(id)
    }

/*    fun update(id: String): Message? {
        val message = getById(id)

        message.ifPresentOrElse(
            { value ->
                value.apply {
                    unread = !value.unread
                }
            },
            {
                throw ResponseStatusException(HttpStatus.NOT_FOUND)
            })

        return message.let { messageRepository.saveAndFlush(it) }
    }*/
}