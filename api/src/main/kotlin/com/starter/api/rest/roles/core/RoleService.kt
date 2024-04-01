package com.starter.api.rest.roles.core

import com.starter.api.exception.NotFoundException
import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.enums.RoleType
import org.springframework.stereotype.Service

@Service
class RoleService(val roleRepository: RoleRepository) {
    fun findAll(): List<Role> {
        return roleRepository.findAll()
    }

    // TODO @ed test this
    fun getByType(type: RoleType = RoleType.USER): Role =
        roleRepository.getRoleByType(type)
            ?: throw NotFoundException("Role with type: ($type) was not found!")

    fun create(roleRequest: RoleRequest): Role {
        val role =
            Role(
                type = roleRequest.type,
            )

        return roleRepository.saveAndFlush(role)
    }
}
