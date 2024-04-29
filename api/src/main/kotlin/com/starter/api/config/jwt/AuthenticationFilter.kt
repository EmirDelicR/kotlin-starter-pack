package com.starter.api.config.jwt

import com.starter.api.rest.users.core.CustomUserDetailsService
import com.starter.api.utils.JWTHandler
import com.starter.api.utils.logger
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

@Component
class AuthenticationFilter(
    private val userDetailsService: CustomUserDetailsService,
    private val jwtHandler: JWTHandler,
) : OncePerRequestFilter() {
    private val log = logger()

    @Throws(IOException::class, ServletException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        try {
            val authHeader: String? = request.getHeader("Authorization")

            if (doesNotContainBearerToken(authHeader)) {
                filterChain.doFilter(request, response)
                return
            }

            val jwt = authHeader!!.substringAfter("Bearer ")
            val email = jwtHandler.getUserEmailFromJwtToken(jwt)

            if (email != null && SecurityContextHolder.getContext().authentication == null) {
                val foundUser = userDetailsService.loadUserByUsername(email)

                if (jwtHandler.isTokenValid(jwt, foundUser)) {
                    updateContext(foundUser, request)
                }
            }
        } catch (e: Exception) {
            log.error("Cannot set user authentication: ${e.message}")
        }

        filterChain.doFilter(request, response)
    }

    private fun updateContext(
        foundUser: UserDetails,
        request: HttpServletRequest,
    ) {
        val authentication = UsernamePasswordAuthenticationToken(foundUser, null, foundUser.authorities)
        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authentication
    }

    private fun doesNotContainBearerToken(authHeader: String?): Boolean {
        return authHeader == null || !authHeader.startsWith("Bearer ")
    }
}
