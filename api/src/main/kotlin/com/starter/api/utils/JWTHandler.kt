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
    private lateinit var jwtSecret: String

    // 24h
    private val jwtExpires: Long = 8640000
    private val jwtRefreshExpires: Long = 8640000 * 2

    // https://github.com/eugenp/tutorials/blob/master/spring-security-modules/spring-security-core-2/src/main/java/com/baeldung/jwtsignkey/jwtconfig/JwtUtils.java
    // https://www.youtube.com/watch?v=iqkt9ip567A&list=PLvN8k8yxjoeud4ESoB-wjiieqYGaDVqPR&index=7

    fun generateJwtToken(email: String, isRefreshToken: Boolean = false): String {
        var expiresIn = jwtExpires

        if(isRefreshToken) {
            expiresIn = jwtRefreshExpires
        }

        return Jwts.builder()
            .subject((email))
            .issuedAt(Date())
            .expiration(Date(Date().time + expiresIn))
            .signWith(getSigningKey())
            .compact()
    }

    fun getUserEmailFromJwtToken(token: String?): String? {
        return getAllClaims(token).subject
    }

    fun isTokenValid(token: String?, userDetails: UserDetails): Boolean {
        val email = getUserEmailFromJwtToken(token)

        return userDetails.username == email && !isTokenExpired(token)
    }

    fun isTokenExpired(token: String?): Boolean {
        return getAllClaims(token).expiration.before(Date())
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
}