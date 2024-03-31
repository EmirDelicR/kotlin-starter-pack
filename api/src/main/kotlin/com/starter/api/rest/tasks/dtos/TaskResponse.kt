package com.starter.api.rest.tasks.dtos

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class TaskResponse(
    val id: String,
    val title: String,
    val completed: Boolean,
)
