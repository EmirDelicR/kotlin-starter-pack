package com.starter.api.utils

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.PropertySource
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
@PropertySource("classpath:application.properties")
class JWTHandler {
    @Value("\${jwt.secret}")
    private var jwtSecret: String = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"

    // 24h
    private val jwtExpires: Long = 86400000
    private val jwtRefreshExpires: Long = 86400000 * 2

    fun generateJwtToken(
        email: String,
        isRefreshToken: Boolean = false,
    ): String {
        var expiresIn = jwtExpires

        if (isRefreshToken) {
            expiresIn = jwtRefreshExpires
        }

        return Jwts.builder()
            .subject((email))
            .issuedAt(Date())
            .expiration(generateExpirationTime(expiresIn))
            .signWith(getSigningKey())
            .compact()
    }

    fun getUserEmailFromJwtToken(token: String?): String? {
        return getAllClaims(token).subject
    }

    fun isTokenValid(
        token: String?,
        userDetails: UserDetails,
    ): Boolean {
        val email = getUserEmailFromJwtToken(token)

        return userDetails.username == email && !isTokenExpired(token)
    }

    fun isTokenExpired(token: String?): Boolean {
        return try {
            getAllClaims(token).expiration.before(Date())
        } catch (ex: Exception) {
            logger.error("Token expired", ex)
            true
        }
    }

    private fun getSigningKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(jwtSecret)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    private fun getAllClaims(token: String?): Claims {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .payload
    }

    fun generateExpirationTime(expiresIn: Long): Date {
        return Date(Date().time + expiresIn)
    }
}
