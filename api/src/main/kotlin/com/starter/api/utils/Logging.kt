package com.starter.api.utils

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class Logging {
    companion object {
        private val objectMapper: ObjectMapper = jacksonObjectMapper()

        fun toJson(data: Any): String {
            objectMapper.registerModule(JavaTimeModule())
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data)
        }
    }
}

inline fun <reified T> T.logger(): Logger {
    return LoggerFactory.getLogger(T::class.java)
}
