package com.starter.api.rest.roles.core

import com.starter.api.rest.roles.enums.RoleType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository : JpaRepository<Role, String>, JpaSpecificationExecutor<Role> {
    fun getRoleByType(type: RoleType): Role?
}
