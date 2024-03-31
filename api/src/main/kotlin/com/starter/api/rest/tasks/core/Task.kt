package com.starter.api.rest.tasks.core

import com.starter.api.rest.tasks.dtos.TaskResponse
import com.starter.api.rest.users.core.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "task")
data class Task(
    @Id
    @Column(name = "id")
    val id: String = UUID.randomUUID().toString(),
    @Column(name = "title")
    val title: String,
    @Column(name = "completed")
    var completed: Boolean = false,
    @CreationTimestamp
    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    val user: User? = null,
) {
    @PreUpdate
    fun preUpdate() {
        updatedAt = OffsetDateTime.now()
    }

    fun toResponse(): TaskResponse {
        return TaskResponse(id, title, completed, user?.id, createdAt)
    }
}
