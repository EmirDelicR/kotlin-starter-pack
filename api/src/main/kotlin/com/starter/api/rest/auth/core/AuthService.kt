package com.starter.api.rest.auth.core

import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.rest.auth.dtos.AuthResponse
import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.users.core.User
import com.starter.api.rest.users.core.UserService
import com.starter.api.utils.JWTHandler
import com.starter.api.utils.PasswordEncoder
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userService: UserService,
    private val roleService: RoleService,
    private val jwtHandler: JWTHandler,
) {
    fun registerUser(data: RegisterUserRequest): AuthResponse {
        val user = userService.getByEmail(data.email)

        if (user != null) {
            throw ConflictException("User with email: (${data.email}) was already register!")
        }

        val role = roleService.getByType()
        val refreshToken = jwtHandler.generateJwtToken(data.email, true)

        return AuthResponse(
            token = setCookie(refreshToken),
            userService.create(data, role),
        )
    }

    fun loginUser(data: LoginUserRequest): AuthResponse {
        val user =
            userService.getByEmail(data.email)
                ?: throw NotFoundException("User with email: (${data.email}) was not found!")

        PasswordEncoder.verifyPassword(data.password, user.password)

        return updateTokenAndGetAuthResponse(user)
    }

    fun autoLoginUser(token: String): AuthResponse {
        if (jwtHandler.isTokenExpired(token)) {
            throw NotValidException("This token is not valid. Please login again!")
        }

        val email =
            jwtHandler.getUserEmailFromJwtToken(token)
                ?: throw NotValidException("This token is not valid. Please login again!")

        val user =
            userService.getByEmail(email)
                ?: throw NotFoundException("User with email: ($email) was not found!")

        return updateTokenAndGetAuthResponse(user)
    }

    fun updateToken(token: String): String {
        if (jwtHandler.isTokenExpired(token)) {
            throw NotValidException("This token is not valid. Please login again!")
        }

        val email =
            jwtHandler.getUserEmailFromJwtToken(token)
                ?: throw NotValidException("This token is not valid. Please login again!")

        val user =
            userService.getByEmail(email)
                ?: throw NotFoundException("User with email: ($email) was not found!")

        val generatedToken = jwtHandler.generateJwtToken(user.email)
        val refreshToken = jwtHandler.generateJwtToken(user.email, true)

        userService.updateToken(user, generatedToken)

        return setCookie(refreshToken)
    }

    private fun setCookie(token: String): String {
        return ResponseCookie.from("jwt", token)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(3600)
            .build().toString()
    }

    private fun updateTokenAndGetAuthResponse(user: User): AuthResponse {
        val token = jwtHandler.generateJwtToken(user.email)
        val refreshToken = jwtHandler.generateJwtToken(user.email, true)
        val updatedUser = userService.updateUserAuthState(user, token)

        return AuthResponse(token = setCookie(refreshToken), user = updatedUser)
    }
}
