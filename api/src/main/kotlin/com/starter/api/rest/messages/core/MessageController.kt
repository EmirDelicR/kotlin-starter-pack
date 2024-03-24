package com.starter.api.rest.messages.core

import com.starter.api.dtos.PageableResponse
import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.messages.dtos.MessageRequest
import com.starter.api.rest.messages.dtos.MessageResponse
import com.starter.api.utils.PageableResolver
import com.starter.api.utils.logger
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
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

    /** GET /messages/paginated?page=1&pageSize=1&columnId=''&filter=''&order='DESC' */
    @GetMapping("/paginated")
    @ResponseStatus(HttpStatus.OK)
    fun getMessage(
        @RequestParam(
            name = "page",
            defaultValue = "1",
        )
        @Min(value = 1, message = "Page Value must be at least 1")
        @Max(value = 100, message = "Page Value must be less then 100") page: Int,
        @RequestParam(
            name = "pageSize",
            defaultValue = "10",
        ) @Min(value = 0, message = "Page Size must be greater than or equal 0") pageSize: Int,
        @RequestParam(name = "filter", defaultValue = "") filter: String,
        @RequestParam(name = "order", defaultValue = PageableResolver.ORDER_DEFAULT_VALUE) order: String,
        @RequestParam(name = "columnId", defaultValue = PageableResolver.SORT_DEFAULT_FIELD) columnId: String,
    ): ResponseEnvelope<PageableResponse<Message>> {
        logger.info("Handling getMessages/paginated Request")
        val messages: PageableResponse<Message> = messageService.findAll(filter, order, columnId, page, pageSize)

        return ResponseEnvelope(
            data = messages,
            message = "Fetch messages was successful.",
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
        logger.info("Handling deleteMessage Request")
        messageService.remove(id)

        return ResponseEnvelope(
            data = null,
            message = "Message with id: ($id) was deleted successfully.",
            status = HttpStatus.OK.value(),
        )
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateMessage(
        @PathVariable id: String,
    ): ResponseEnvelope<MessageResponse> {
        logger.info("Handling updateMessage Request")
        val msg: Message = messageService.update(id)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Message with id ($id) was updated successfully.",
            status = HttpStatus.OK.value(),
        )
    }
}
