package com.starter.api.rest.roles.core

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.dtos.RoleResponse
import com.starter.api.utils.logger
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/roles"])
class RoleController(val roleService: RoleService) {
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    fun getRoles(): ResponseEnvelope<List<RoleResponse>> {
        logger.info("Handling getRoles Request")
        val roles = roleService.findAll()

        return ResponseEnvelope(
            data = roles.map { it.toResponse() },
            message = "Fetch roles successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun saveRole(
        @RequestBody @Valid roleRequest: RoleRequest,
    ): ResponseEnvelope<RoleResponse> {
        logger.info("Handling saveRole Request")
        val role = roleService.create(roleRequest)

        return ResponseEnvelope(
            data = role.toResponse(),
            message = "Role was created successful.",
            status = HttpStatus.CREATED.value(),
        )
    }
}
