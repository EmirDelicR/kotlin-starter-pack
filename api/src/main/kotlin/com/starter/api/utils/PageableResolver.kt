package com.starter.api.utils

import com.starter.api.exception.NotValidException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

class PageableResolver {
    companion object {
        const val SORT_DEFAULT_FIELD = "createdAt"
        const val ORDER_DEFAULT_VALUE = "DESC"
        val allowedOrderingParams = listOf(SORT_DEFAULT_FIELD, "sender")
    }

    private fun getSortingDirection(order: String): Sort.Direction {
        return when (order) {
            "ASC" -> Sort.Direction.ASC
            else -> Sort.Direction.DESC
        }
    }

    private fun validateColumnIdOrderByProperty(columnId: String) {
        if (!allowedOrderingParams.contains(columnId)) {
            throw NotValidException(
                "Cannot sort by $columnId.Allowed sorting fields: ${allowedOrderingParams.joinToString()}",
            )
        }
    }

    fun isFilterEmpty(filter: String): Boolean {
        return filter.trim().isEmpty()
    }

    fun getSortObject(
        order: String = ORDER_DEFAULT_VALUE,
        columnId: String = SORT_DEFAULT_FIELD,
    ): Sort {
        val direction = getSortingDirection(order)
        validateColumnIdOrderByProperty(columnId)
        return Sort.by(direction, columnId)
    }

    fun getPageableObject(
        offset: Int,
        limit: Int,
        sort: Sort,
    ): PageRequest {
        return PageRequest.of(offset - 1, limit, sort)
    }
}
