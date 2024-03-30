package com.starter.api.rest.roles.core

import com.starter.api.rest.roles.dtos.RoleRequest
import org.springframework.stereotype.Service

@Service
class RoleService(val roleRepository: RoleRepository) {
    fun findAll(): List<Role> {
        return roleRepository.findAll()
    }

    fun create(roleRequest: RoleRequest): Role {
        val role =
            Role(
                type = roleRequest.type,
            )

        return roleRepository.saveAndFlush(role)
    }
}
