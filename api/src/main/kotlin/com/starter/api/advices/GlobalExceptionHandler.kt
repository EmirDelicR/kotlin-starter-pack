package com.starter.api.advices

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.utils.logger
import jakarta.validation.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler
    fun handle(exception: NotValidException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling NotValidException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.message.toString(),
                status = HttpStatus.BAD_REQUEST.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: NotFoundException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling NotFoundException:", exception)

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ResponseEnvelope(
                data = null,
                message = exception.message.toString(),
                status = HttpStatus.NOT_FOUND.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: ConflictException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling ConflictException:", exception)

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ResponseEnvelope(
                data = null,
                message = exception.message.toString(),
                status = HttpStatus.CONFLICT.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: MethodArgumentNotValidException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling MethodArgumentNotValidException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.bindingResult.fieldErrors[0].defaultMessage.toString(),
                status = HttpStatus.BAD_REQUEST.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: ConstraintViolationException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling ConstraintViolationException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.constraintViolations.first().message,
                status = HttpStatus.BAD_REQUEST.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: DataIntegrityViolationException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling ConstraintViolationException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.cause?.cause?.message.toString(),
                status = HttpStatus.BAD_REQUEST.value(),
            ),
        )
    }

    @ExceptionHandler
    fun handle(exception: HttpMessageNotReadableException): ResponseEntity<ResponseEnvelope<Nothing?>> {
        logger.error("Handling ConstraintViolationException:", exception)

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseEnvelope(
                data = null,
                message = exception.message.toString(),
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
