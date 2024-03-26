package com.starter.api.utils

import com.starter.api.exception.NotValidException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

class PageableResolverTest {
    private val pageableResolver = PageableResolver()

    @Test
    fun `Test isFilterEmpty should return true if filter is empty`() {
        assertThat(pageableResolver.isFilterEmpty("")).isTrue()
        assertThat(pageableResolver.isFilterEmpty("    ")).isTrue()
    }

    @Test
    fun `Test isFilterEmpty should return false if filter is not empty`() {
        assertThat(pageableResolver.isFilterEmpty("test")).isFalse()
        assertThat(pageableResolver.isFilterEmpty(" test ")).isFalse()
    }

    @Test
    fun `Test getSortObject should return sort object if all data is valid`() {
        assertThat(pageableResolver.getSortObject("DESC", "createdAt")).isEqualTo(Sort.by(Sort.Direction.DESC, "createdAt"))
        assertThat(pageableResolver.getSortObject("ASC", "createdAt")).isEqualTo(Sort.by(Sort.Direction.ASC, "createdAt"))
        assertThat(pageableResolver.getSortObject("test", "createdAt")).isEqualTo(Sort.by(Sort.Direction.DESC, "createdAt"))
        assertThat(pageableResolver.getSortObject("", "createdAt")).isEqualTo(Sort.by(Sort.Direction.DESC, "createdAt"))
    }

    @Test
    fun `Test getSortObject should throw exception if columnId is not valid`() {
        val columnId = "createdA"
        val exc = assertThrows<NotValidException> { pageableResolver.getSortObject("DESC", columnId) }
        assertThat(
            exc.message,
        ).isEqualTo("Cannot sort by $columnId.Allowed sorting fields: ${PageableResolver.allowedOrderingParams.joinToString()}")
    }

    @Test
    fun `Test getPageableObject should PageRequest if data is valid`() {
        val sort = pageableResolver.getSortObject("DESC", "createdAt")
        assertThat(pageableResolver.getPageableObject(1, 5, sort)).isEqualTo(PageRequest.of(0, 5, sort))
    }
}
