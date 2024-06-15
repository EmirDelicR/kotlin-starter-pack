package com.starter.api.utils

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class JsonUtil(objectMapper: ObjectMapper) {
    init {
        Companion.objectMapper = objectMapper
    }

    companion object {
        lateinit var objectMapper: ObjectMapper

        fun toJson(data: Any): String {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data)
        }
    }
}

val Any.logger: Logger
    get() = LoggerFactory.getLogger(javaClass)
