package com.starter.api.exception

import org.springframework.http.HttpStatus

class NotFoundException(
    message: String,
    val data: Nothing? = null,
    val status: Number = HttpStatus.NOT_FOUND.value(),
) : Exception(message)