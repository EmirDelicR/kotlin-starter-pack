package com.starter.api.messages.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.messages.dtos.MessageRequest
import com.starter.api.messages.dtos.MessageResponse
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/messages"])
class MessageController(val messageService: MessageService) {
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getMessage(@PathVariable id: String): ResponseEnvelope<MessageResponse?> {
        val msg =
            messageService.getById(id)
                ?:  return ResponseEnvelope(
                    data = null,
                    message = "Message with $id was not found!",
                    status = 404
                )

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Fetch message successful.",
            status = 200
        )
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun saveMessage(@RequestBody messageRequest: MessageRequest): ResponseEnvelope<MessageResponse> {
        val msg: Message = messageService.create(messageRequest)
        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Message was send successful.",
            status = 201
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteMessage(@PathVariable id: String): ResponseEnvelope<Nothing?> {
        messageService.remove(id)

        return ResponseEnvelope(
            data = null,
            message = "Message with id $id was deleted successfully.",
            status = 200
        )
    }


/*    @PutMapping("v1/messages/{id}")
    fun updateMessage(@PathVariable id: String) = messageService.update(id)*/
}