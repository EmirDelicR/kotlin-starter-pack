package com.starter.api.rest.roles.dtos

import com.fasterxml.jackson.annotation.JsonInclude
import com.starter.api.rest.roles.enums.RoleType

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class RoleResponse(
    val id: String,
    val type: RoleType,
)
