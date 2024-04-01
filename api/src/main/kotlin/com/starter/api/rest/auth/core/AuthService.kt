package com.starter.api.rest.auth.core

import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.users.core.User
import com.starter.api.rest.users.core.UserService
import org.springframework.stereotype.Service

@Service
class AuthService(val userService: UserService, val roleService: RoleService) {

    fun registerUser(data: RegisterUserRequest): User {
        userService.getByEmail(data.email)
        val role = roleService.getByType()

        return userService.create(data, role)
    }

    fun loginUser(data: LoginUserRequest): User {
        val user = userService.getByEmail(data.email)
        val role = roleService.getByType()
        // TODO @ed implement this
        return user
    }
}