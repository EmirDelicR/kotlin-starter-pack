package com.starter.api.exception

class ConflictException(
    message: String,
    val data: Nothing? = null,
) : Exception(message)
