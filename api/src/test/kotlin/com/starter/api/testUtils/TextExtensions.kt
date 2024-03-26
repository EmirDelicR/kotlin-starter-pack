package com.starter.api.testUtils

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockHttpServletRequestDsl

fun MockHttpServletRequestDsl.withJsonContent(jsonContent: Any) {
    characterEncoding = "UTF-8"
    contentType = MediaType.APPLICATION_JSON
    accept = MediaType.APPLICATION_JSON
    content = ObjectMapper().writeValueAsString(jsonContent)
}