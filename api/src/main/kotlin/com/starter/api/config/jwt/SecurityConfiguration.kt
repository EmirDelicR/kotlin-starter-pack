package com.starter.api.config.jwt

import com.starter.api.rest.roles.enums.RoleType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfiguration(val authenticationProvider: AuthenticationProvider) {
    private final val whiteListUrl: Array<String> =
        arrayOf("/h2-console/**", "**/register", "**/login", "/swagger-ui/**", "/swagger-ui/index.html", "/v3/api-docs/**")
    private final val adminListUrl: Array<String> =
        arrayOf("/roles/**", "/subscriptions/**")

    @Autowired
    private val unauthorizedHandler: EntryPoint? = null

    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(http: HttpSecurity, jwtAuthenticationFilter: AuthenticationFilter): SecurityFilterChain {
        http.csrf { obj: CsrfConfigurer<HttpSecurity> -> obj.disable() }
            .cors { obj: CorsConfigurer<HttpSecurity> -> obj.disable() }
            .authorizeHttpRequests { req ->
                req.requestMatchers(*whiteListUrl)
                    .permitAll()
                    .requestMatchers(*adminListUrl)
                    .hasRole(RoleType.ADMIN.toString())
                    .anyRequest()
                    .authenticated()
            }
            .exceptionHandling { ex: ExceptionHandlingConfigurer<HttpSecurity?> ->
                ex.authenticationEntryPoint(
                    unauthorizedHandler
                )
            }
            .sessionManagement { session: SessionManagementConfigurer<HttpSecurity?> ->
                session.sessionCreationPolicy(
                    STATELESS
                )
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}