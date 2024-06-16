package com.starter.api.config.jwt

import com.starter.api.rest.roles.enums.RoleType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfiguration(private val authenticationProvider: AuthenticationProvider) {
    private final val whiteListUrl: Array<String> =
        arrayOf(
            "/h2-console/**",
            "/api/v1/register",
            "/api/v1/login",
            "/api/v1/autoLogin",
            "/swagger-ui/**",
            "/swagger-ui/index.html",
            "/v3/api-docs/**",
            "/error",
        )

    @Autowired
    private val unauthorizedHandler: EntryPoint? = null

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3000")
        configuration.allowedMethods = listOf(
            "HEAD",
            "GET", "POST", "PUT", "DELETE", "PATCH"
        )
        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.allowCredentials = true
        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthenticationFilter: AuthenticationFilter,
    ): DefaultSecurityFilterChain {
        http.csrf { it.disable() }
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests { req ->
                req.requestMatchers(HttpMethod.OPTIONS,"/api/v1/**").permitAll()
                    .requestMatchers(*whiteListUrl)
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, *arrayOf("/api/v1/subscriptions", "/api/v1/roles"))
                    .hasRole(RoleType.ADMIN.toString())
                    .requestMatchers(HttpMethod.GET, "/api/v1/messages/**")
                    .hasRole(RoleType.ADMIN.toString())
                    .requestMatchers(HttpMethod.PUT, "/api/v1/messages/**")
                    .hasRole(RoleType.ADMIN.toString())
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/messages/**")
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
