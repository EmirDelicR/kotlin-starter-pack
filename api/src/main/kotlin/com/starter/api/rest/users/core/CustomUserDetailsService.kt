package com.starter.api.rest.users.core

import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

typealias ApplicationUser = com.starter.api.rest.users.core.User

@Service
class CustomUserDetailsService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        return userRepository.findUserByEmail(username)?.mapToUserDetails()
            ?: throw UsernameNotFoundException("User with email $username not found")
    }

    private fun ApplicationUser.mapToUserDetails(): UserDetails {
        val role: String = (this.role?.type ?: "USER").toString()

        return User.builder().username(this.email).password(this.password).roles(role).build()
    }
}
