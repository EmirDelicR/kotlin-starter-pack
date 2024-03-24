package com.starter.api.dtos

data class PageableResponse<T>(
    val totalCount: Long,
    val numberOfPages: Int,
    val items: List<T>,
)
