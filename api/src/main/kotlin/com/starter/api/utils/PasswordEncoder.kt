package com.starter.api.utils

import com.starter.api.exception.NotValidException
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder


class PasswordEncoder private constructor() {
    companion object {
        private var arg2SpringSecurityInstance: Argon2PasswordEncoder? = null

        private fun getInstance(): Argon2PasswordEncoder {
            if (arg2SpringSecurityInstance == null) {
                arg2SpringSecurityInstance = Argon2PasswordEncoder(16, 32, 1, 60000, 10)
            }

            return arg2SpringSecurityInstance as Argon2PasswordEncoder
        }

        fun hashPassword(password: String): String {
            return getInstance().encode(password)
        }

        fun verifyPassword(rawPassword: String, hashedPassword: String): Boolean {
            val isPasswordOk = getInstance().matches(rawPassword, hashedPassword)

            if(!isPasswordOk) {
                throw NotValidException("Unfortunately password is not valid. Please try again and check password that you input!")
            }

            return true
        }
    }
}
