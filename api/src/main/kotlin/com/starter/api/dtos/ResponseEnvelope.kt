package com.starter.api.dtos

class ResponseEnvelope<T>(
    val data: T,
    val status: Number,
    val message: String,
)
