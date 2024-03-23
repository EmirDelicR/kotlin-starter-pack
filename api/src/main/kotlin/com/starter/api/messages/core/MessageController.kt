package com.starter.api.messages.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.messages.dtos.MessageRequest
import com.starter.api.messages.dtos.MessageResponse
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/messages"])
class MessageController(val messageService: MessageService) {
    private val logger = logger()

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getMessage(
        @PathVariable id: String,
    ): ResponseEnvelope<MessageResponse?> {
        logger.info("Handling getMessage Request with id: $id")
        val msg = messageService.getById(id)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Fetch message successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun saveMessage(
        @Valid @RequestBody messageRequest: MessageRequest,
    ): ResponseEnvelope<MessageResponse> {
        logger.info("Handling saveMessage Request")
        val msg: Message = messageService.create(messageRequest)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Message was send successful.",
            status = HttpStatus.CREATED.value(),
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteMessage(
        @PathVariable id: String,
    ): ResponseEnvelope<Nothing?> {
        messageService.remove(id)

        return ResponseEnvelope(
            data = null,
            message = "Message with id: ($id) was deleted successfully.",
            status = HttpStatus.OK.value(),
        )
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateMessage(@PathVariable id: String): ResponseEnvelope<MessageResponse> {
        val msg: Message = messageService.update(id)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Message with id ($id) was updated successfully.",
            status = HttpStatus.OK.value(),
        )
    }
}
