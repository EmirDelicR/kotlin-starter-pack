package com.starter.api.config.jwt

import com.starter.api.rest.roles.enums.RoleType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfiguration(private val authenticationProvider: AuthenticationProvider) {
    private final val whiteListUrl: Array<String> =
        arrayOf("/h2-console/**", "/api/v1/register", "/api/v1/login", "/api/v1/autoLogin", "/swagger-ui/**", "/swagger-ui/index.html", "/v3/api-docs/**", "/error")

    @Autowired
    private val unauthorizedHandler: EntryPoint? = null

    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthenticationFilter: AuthenticationFilter,
    ): DefaultSecurityFilterChain {
        http.csrf { obj: CsrfConfigurer<HttpSecurity> -> obj.disable() }
            .cors { obj: CorsConfigurer<HttpSecurity> -> obj.disable() }
            .authorizeHttpRequests { req ->
                req.requestMatchers(*whiteListUrl)
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/subscriptions")
                        .hasRole(RoleType.ADMIN.toString())
                        .requestMatchers(HttpMethod.POST, "/api/v1/roles")
                        .hasRole(RoleType.ADMIN.toString())
                        .anyRequest()
                        .fullyAuthenticated()

            }
            .exceptionHandling { ex: ExceptionHandlingConfigurer<HttpSecurity?> ->
                ex.authenticationEntryPoint(
                    unauthorizedHandler,
                )
            }
            .sessionManagement { session: SessionManagementConfigurer<HttpSecurity?> ->
                session.sessionCreationPolicy(
                    STATELESS,
                )
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}
