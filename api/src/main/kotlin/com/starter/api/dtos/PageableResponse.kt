package com.starter.api.dtos

class PageableResponse<T>(
    val totalCount: Long,
    val numberOfPages: Int,
    val items: List<T>,
)
