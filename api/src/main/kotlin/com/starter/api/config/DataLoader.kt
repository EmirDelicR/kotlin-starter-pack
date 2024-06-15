package com.starter.api.config

import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.subscriptions.core.SubscriptionService
import com.starter.api.rest.subscriptions.dtos.SubscriptionRequest
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component


@Component
class DataLoader(private val roleService: RoleService, private val subscriptionService: SubscriptionService) : CommandLineRunner {
    @Throws(Exception::class)
    override fun run(vararg args: String) {
        // Load initial data into the database
        addRoleSamples()
        addSubscriptionSamples()
    }

    private fun addRoleSamples() {
        val roles = roleService.findAll()

        if(roles.isEmpty()) {
            roleService.create(RoleRequest(type = RoleType.ADMIN))
            roleService.create(RoleRequest(type = RoleType.USER))
        }
    }

    private fun addSubscriptionSamples() {
        val subscriptions = subscriptionService.findAll()

        if(subscriptions.isEmpty()) {
            subscriptionService.create(SubscriptionRequest(name = SubscriptionType.NEWS))
            subscriptionService.create(SubscriptionRequest(name = SubscriptionType.CODE))
            subscriptionService.create(SubscriptionRequest(name = SubscriptionType.GENERAL))
        }
    }
}