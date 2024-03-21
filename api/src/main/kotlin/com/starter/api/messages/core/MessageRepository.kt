package com.starter.api.messages.core

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : JpaRepository<Message, String>, JpaSpecificationExecutor<Message>
