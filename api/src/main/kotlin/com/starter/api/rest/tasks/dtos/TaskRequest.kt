package com.starter.api.rest.tasks.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank

@JsonIgnoreProperties(ignoreUnknown = true)
data class TaskRequest(
    @field:NotBlank(message = "Title must not be blank!")
    val title: String,
    @field:NotBlank(message = "user id must be set!")
    val userId: String,
)
