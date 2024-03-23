package com.starter.api.messages.core

import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : JpaRepository<Message, String>, JpaSpecificationExecutor<Message> {
    // TODO add limit and count
    @Query(
        value = "SELECT m FROM Message m where LOWER(m.email) LIKE %:filter% or LOWER(m.message) LIKE %:filter% or LOWER(m.sender) LIKE %:filter%",
        countQuery = "SELECT count(*) FROM Message m",
    )
    fun findAndCount(
        filter: String,
        sort: Sort,
    ): List<Message>

    @Query(value = "SELECT m FROM Message m")
    fun countAllByIdAndOrderBy(sort: Sort): List<Message>
}
