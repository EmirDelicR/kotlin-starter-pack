package com.starter.api.advices

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.utils.logger
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    private val logger = logger()

    @ExceptionHandler
    fun handle(exception: NotValidException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling NotValidException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.message as String,
                status = exception.status,
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: NotFoundException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling NotFoundException:", exception)

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ResponseEnvelope(
                data = null,
                message = exception.message as String,
                status = exception.status,
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: MethodArgumentNotValidException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling MethodArgumentNotValidException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.bindingResult.fieldErrors[0].defaultMessage as String,
                status = HttpStatus.BAD_REQUEST.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: Exception): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling generic exception:", exception)

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ResponseEnvelope(
                data = null,
                message = "An unexpected error occurred",
                status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ),
        )
    }
}
