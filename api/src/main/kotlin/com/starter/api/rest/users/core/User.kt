package com.starter.api.rest.users.core

import com.starter.api.rest.roles.core.Role
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.rest.users.dtos.UserResponse
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
@Table(name = "user")
data class User(
    @Id
    @Column(name = "id")
    val id: String = UUID.randomUUID().toString(),
    @Column(name = "email", unique = true)
    var email: String,
    @Column(name = "password")
    var password: String,
    @Column(name = "age", nullable = true)
    var age: Int,
    @Column(name = "avatar", nullable = true)
    var avatar: String,
    @Column(name = "firstName", nullable = true)
    var firstName: String,
    @Column(name = "lastName", nullable = true)
    var lastName: String,
    @Column(name = "userName", nullable = true)
    var userName: String,
    @Column(name = "token", nullable = true)
    var token: String,
    @Column(name = "loggedIn")
    var loggedIn: Boolean = false,
    @Column(name = "profileUpdated")
    var profileUpdated: Boolean = false,
    @Column(name = "subscribed")
    var subscribed: Boolean = false,
    @CreationTimestamp
    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
) {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private val role: Role? = null

    @PreUpdate
    fun preUpdate() {
        updatedAt = OffsetDateTime.now()
    }

    fun toResponse(): UserResponse {
        return UserResponse(
            id,
            email,
            role,
            age,
            avatar,
            firstName,
            lastName,
            userName,
            token,
            loggedIn,
            profileUpdated,
            subscribed,
            subscriptions = arrayOf(SubscriptionType.GENERAL),
            createdAt,
            updatedAt,
        )
    }
}
