package com.starter.api.rest.auth.core

import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.users.core.User
import com.starter.api.rest.users.core.UserService
import com.starter.api.utils.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(val userService: UserService, val roleService: RoleService) {
    fun registerUser(data: RegisterUserRequest): User {
        val user = userService.getByEmail(data.email)

        if (user != null) {
            throw ConflictException("User with email: (${data.email}) was already register!")
        }

        val role = roleService.getByType()

        // TODO return refresh token or create function
        // const refreshToken = signToken(password, email, true);

        return userService.create(data, role)
    }

    fun loginUser(data: LoginUserRequest): User {
        val user =
            userService.getByEmail(data.email)
                ?: throw NotFoundException("User with email: (${data.email}) was not found!")

        PasswordEncoder.verifyPassword(data.password, user.password)
        // TODO @ed implement this
        // update user token
        // const refreshToken = signToken(password, email, true);
        // update user login status
        // user.token = signToken(password, email);
        // user.loggedIn = true;
        // await userService.saveUser(user);
        return user
    }
}
