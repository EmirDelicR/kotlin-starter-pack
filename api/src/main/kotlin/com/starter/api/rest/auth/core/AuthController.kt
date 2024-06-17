package com.starter.api.rest.auth.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.auth.dtos.TokenRequest
import com.starter.api.rest.users.core.User
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/"])
class AuthController(private val authService: AuthService) {
    @PostMapping("/register")
    fun registerUser(
        @RequestBody @Valid registerRequest: RegisterUserRequest,
    ): ResponseEntity<ResponseEnvelope<User>> {
        logger.info("Handling registerUser Request")
        val authResponse = authService.registerUser(registerRequest)

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .header(
                HttpHeaders.SET_COOKIE,
                authResponse.token,
            ).body(
                ResponseEnvelope(
                    data = authResponse.user,
                    message = "User is register successfully.",
                    status = HttpStatus.CREATED.value(),
                ),
            )
    }

    @PostMapping("/login")
    fun loginUser(
        @RequestBody @Valid loginRequest: LoginUserRequest,
    ): ResponseEntity<ResponseEnvelope<User>> {
        logger.info("Handling loginUser Request")
        val authResponse = authService.loginUser(loginRequest)

        return ResponseEntity.ok()
            .header(
                HttpHeaders.SET_COOKIE,
                authResponse.token,
            ).body(
                ResponseEnvelope(
                    data = authResponse.user,
                    message = "User was logged in successfully.",
                    status = HttpStatus.OK.value(),
                ),
            )
    }

    @PostMapping("/autoLogin")
    fun autoLoginUser(
        @RequestBody @Valid tokenRequest: TokenRequest,
    ): ResponseEntity<ResponseEnvelope<User>> {
        logger.info("Handling autoLoginUser Request")
        val authResponse = authService.autoLoginUser(tokenRequest.token)

        return ResponseEntity.ok()
            .header(
                HttpHeaders.SET_COOKIE,
                authResponse.token,
            ).body(
                ResponseEnvelope(
                    data = authResponse.user,
                    message = "User was logged in successfully.",
                    status = HttpStatus.OK.value(),
                ),
            )
    }

    @PutMapping("/refresh")
    fun updateToken(
        @RequestBody @Valid tokenRequest: TokenRequest,
    ): ResponseEntity<ResponseEnvelope<String>> {
        logger.info("Handling refresh token Request")
        val updatedToken = authService.updateToken(tokenRequest.token)

        return ResponseEntity.ok()
            .header(
                HttpHeaders.SET_COOKIE,
                updatedToken,
            ).body(
                ResponseEnvelope(
                    data = updatedToken,
                    message = "Token was refreshed successfully.",
                    status = HttpStatus.OK.value(),
                ),
            )
    }
}
