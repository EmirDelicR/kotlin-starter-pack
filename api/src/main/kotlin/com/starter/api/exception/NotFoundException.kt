package com.starter.api.exception

class NotFoundException(
    message: String,
    val data: Nothing? = null,
) : Exception(message)
