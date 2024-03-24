package com.starter.api.dtos

data class ResponseEnvelope<T>(
    val data: T,
    val status: Number,
    val message: String,
)
