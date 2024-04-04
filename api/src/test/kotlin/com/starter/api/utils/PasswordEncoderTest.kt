package com.starter.api.utils

import com.starter.api.exception.NotValidException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatCode
import org.junit.jupiter.api.Test

class PasswordEncoderTest {
    @Test
    fun `Test verifyPassword should return true if password match`() {
        val password = "Test123!"
        val hashPassword = PasswordEncoder.hashPassword(password)

        assertThat(PasswordEncoder.verifyPassword(password, hashPassword)).isTrue()
    }

    @Test
    fun `Test verifyPassword should throw exception if password do not match`() {
        val hashPassword = PasswordEncoder.hashPassword("Test123!")

        assertThatCode {
            PasswordEncoder.verifyPassword("Test", hashPassword)
        }.hasMessage("Unfortunately password is not valid. Please try again and check password that you input!")
            .isInstanceOf(NotValidException::class.java)
    }
}