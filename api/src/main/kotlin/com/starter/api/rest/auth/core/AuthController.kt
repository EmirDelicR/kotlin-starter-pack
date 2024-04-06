package com.starter.api.rest.auth.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.users.dtos.UserResponse
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/"])
class AuthController(val authService: AuthService) {
    private val logger = logger()

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun registerUser(
        @RequestBody @Valid registerRequest: RegisterUserRequest,
    ): ResponseEnvelope<UserResponse> {
        logger.info("Handling registerUser Request")
        val user = authService.registerUser(registerRequest)

        // TODO Set cookie as token to response
        // res.cookie('jwt', refreshToken, COOKIE_OPTIONS);
        return ResponseEnvelope(
            data = user.toResponse(),
            message = "User is register successfully.",
            status = HttpStatus.CREATED.value(),
        )
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    fun loginUser(
        @RequestBody @Valid loginRequest: LoginUserRequest,
    ): ResponseEnvelope<UserResponse> {
        logger.info("Handling loginUser Request")
        val user = authService.loginUser(loginRequest)

        // TODO Set cookie as token to response
        // res.cookie('jwt', refreshToken, COOKIE_OPTIONS);
        return ResponseEnvelope(
            data = user.toResponse(),
            message = "User was logged in successfully.",
            status = HttpStatus.OK.value(),
        )
    }

/*

    @PostMapping("/autoLogin")
    @ResponseStatus(HttpStatus.OK)
    fun autoLoginUser(
        @RequestBody @Valid messageRequest: MessageRequest,
    ): ResponseEnvelope<MessageResponse> {
        logger.info("Handling registerUser Request")
        val msg: Message = messageService.create(messageRequest)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Message was send successful.",
            status = HttpStatus.CREATED.value(),
        )
    }

    @GetMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    fun updateToken(): ResponseEnvelope<MessageResponse?> {
        logger.info("Handling updateToken Request")
        val msg = messageService.getById(id)

        return ResponseEnvelope(
            data = msg.toResponse(),
            message = "Fetch message successful.",
            status = HttpStatus.OK.value(),
        )
    }

*/
}
