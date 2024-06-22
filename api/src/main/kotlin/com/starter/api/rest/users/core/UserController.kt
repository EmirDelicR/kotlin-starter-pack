package com.starter.api.rest.users.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.users.dtos.UserResponse
import com.starter.api.rest.users.dtos.UserUpdateRequest
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/users"])
class UserController(val userService: UserService) {
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getUser(
        @PathVariable id: String,
    ): ResponseEnvelope<UserResponse> {
        logger.info("Handling getUser Request")
        val user = userService.getById(id)

        return ResponseEnvelope(
            data = user.toResponse(),
            message = "Fetch user successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateUser(
        @PathVariable id: String,
        @RequestBody @Valid userRequest: UserUpdateRequest,
    ): ResponseEnvelope<User> {
        logger.info("Handling updateMessage Request")
        val user = userService.update(id, userRequest)

        return ResponseEnvelope(
            data = user,
            message = "User with id ($id) was updated successfully.",
            status = HttpStatus.OK.value(),
        )
    }

    @PutMapping("/{id}/admin")
    @ResponseStatus(HttpStatus.OK)
    fun updateUserAsAdmin(
        @PathVariable id: String,
    ): ResponseEnvelope<UserResponse> {
        logger.info("Handling updateUserAsAdmin Request")
        val user = userService.updateUserAsAdmin(id)

        return ResponseEnvelope(
            data = user.toResponse(),
            message = "User with id ($id) was updated as admin successfully.",
            status = HttpStatus.OK.value(),
        )
    }
}
