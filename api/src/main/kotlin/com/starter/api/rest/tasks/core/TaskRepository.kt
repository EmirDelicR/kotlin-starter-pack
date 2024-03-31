package com.starter.api.rest.tasks.core

import com.starter.api.rest.users.core.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface TaskRepository : JpaRepository<Task, String>, JpaSpecificationExecutor<Task> {
    fun countAllByUser(
        user: User,
        pageable: Pageable,
    ): Page<Task>

    fun findTasksById(id: String): Task?
}
