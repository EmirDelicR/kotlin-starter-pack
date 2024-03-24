package com.starter.api.messages.core

import com.starter.api.exception.NotFoundException
import com.starter.api.messages.dtos.MessageRequest
import com.starter.api.utils.PageableResolver
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MessageService(val messageRepository: MessageRepository) {

    fun getById(id: String): Message =
        messageRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Message with id: ($id) was not found!")

    fun findAll(
        filter: String,
        order: String,
        columnId: String,
    ): List<Message> {
        val pageableResolver = PageableResolver()
        val sort = pageableResolver.getSortObject(order, columnId)

        if (pageableResolver.isFilterEmpty(filter)) {
            return messageRepository.countAllByIdAndOrderBy(sort)
        }

        return messageRepository.findAndCount(filter.lowercase(), sort)
    }

    fun create(messageRequest: MessageRequest): Message {
        val message =
            Message(
                message = messageRequest.message,
                email = messageRequest.email,
                sender = messageRequest.fullName,
                unread = false,
            )

        return messageRepository.saveAndFlush(message)
    }

    fun remove(id: String) {
        if (!messageRepository.existsById(id)) {
            throw NotFoundException("Message with id: ($id) was not found!")
        }

        messageRepository.deleteById(id)
    }

    fun update(id: String): Message {
        val message = getById(id)

        return message.let {
            it.unread = !it.unread
            messageRepository.saveAndFlush(it)
        }
    }
}
