package com.starter.api.rest.roles.dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.starter.api.rest.roles.enums.RoleType

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
data class RoleRequest(
    val type: RoleType,
)
