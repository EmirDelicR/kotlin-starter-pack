package com.starter.api.exception

import org.springframework.http.HttpStatus

class NotValidException(
    message: String,
    val data: Nothing? = null,
    val status: Number = HttpStatus.BAD_REQUEST.value(),
) : Exception(message)
