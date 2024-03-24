package com.starter.api.exception

class NotValidException(
    message: String,
    val data: Nothing? = null,
) : Exception(message)
