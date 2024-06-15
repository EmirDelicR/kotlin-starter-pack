package com.starter.api.rest.tasks.dtos

data class TaskStatisticsResponse(
    val total: Int,
    val done: Int,
    val open: Int,
)
