package com.starter.api.messages.core

import com.starter.api.messages.dtos.MessageResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "message")
class Message(
    @Column(name = "message")
    val message: String,
    @Column(name = "sender")
    val sender: String,
    @Column(name = "email")
    val email: String,
    @Column(name = "unread")
    var unread: Boolean,
    @Id
    @Column(name = "id")
    val id: String = UUID.randomUUID().toString(),
    @CreationTimestamp
    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
) {
    fun toResponse(): MessageResponse {
        return MessageResponse(
            id,
            sender,
            email,
            unread,
            message,
            createdAt,
            updatedAt,
        )
    }
}
