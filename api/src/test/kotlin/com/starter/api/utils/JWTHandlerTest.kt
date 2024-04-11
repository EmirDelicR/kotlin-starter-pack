package com.starter.api.utils

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.userdetails.User

@SpringBootTest
class JWTHandlerTest {
    private val email = "test@test.com"

    @Autowired
    private val jwtHandler = JWTHandler()

    @Test
    fun `Test generateJwtToken should generate token`() {
        assertThat(jwtHandler.generateJwtToken(email)).isNotEmpty()
    }

    @Test
    fun `Test getUserEmailFromJwtToken should return user email token`() {
       val token = jwtHandler.generateJwtToken(email)
       assertThat(jwtHandler.getUserEmailFromJwtToken(token)).isEqualTo(email)
    }

    @Test
    fun `Test isTokenValid should return true if token is valid`() {
        val token = jwtHandler.generateJwtToken(email)
        val user = User.builder().username(email).password("Test").roles("USER").build()
        assertThat(jwtHandler.isTokenValid(token, user)).isTrue()
    }

    @Test
    fun `Test isTokenValid should return false if user is not valid`() {
        val token = jwtHandler.generateJwtToken(email)
        val user = User.builder().username("some@new-email.com").password("Test").roles("USER").build()
        assertThat(jwtHandler.isTokenValid(token, user)).isFalse()
    }
}