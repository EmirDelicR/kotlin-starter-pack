package com.starter.api.rest.users.core

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    fun findUserById(id: String): User?
}