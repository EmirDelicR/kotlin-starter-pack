package com.starter.api.rest.subscriptions.core

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface SubscriptionRepository : JpaRepository<Subscription, String>, JpaSpecificationExecutor<Subscription>