package com.starter.api.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.context.annotation.Configuration

@Configuration
@OpenAPIDefinition(info = Info(title = "Swagger application API", version = "v1"), security = [SecurityRequirement(name = "bearerAuth")])
@SecurityScheme(
    type = SecuritySchemeType.HTTP,
    bearerFormat = "jwt",
    name = "bearerAuth",
    scheme = "bearer",
    `in` = SecuritySchemeIn.HEADER,
    description = "Authorization header can be set by getting the token from user (you will get this token in response after register/login user): Token example: eyJhbGciOiJIUzM4NCJ9.eyJz ...",
)
class SpringdocConfig
