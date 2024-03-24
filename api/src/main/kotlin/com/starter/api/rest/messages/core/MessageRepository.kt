package com.starter.api.rest.messages.core

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : JpaRepository<Message, String>, JpaSpecificationExecutor<Message> {
    @Query(
        value = "SELECT m FROM Message m where LOWER(m.email) LIKE %:filter% or LOWER(m.message) LIKE %:filter% or LOWER(m.sender) LIKE %:filter%",
    )
    fun findAndCountWithFilter(
        filter: String,
        pageable: Pageable,
    ): Page<Message>

    @Query(value = "SELECT m FROM Message m")
    fun findAndCount(pageable: Pageable): Page<Message>
}
