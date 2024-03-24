package com.starter.api.rest.messages.core

import com.starter.api.exception.NotFoundException
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.willThrow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.HttpStatus
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@SpringBootTest
@AutoConfigureMockMvc
class MessageControllerTest(@Autowired val mockMvc: MockMvc) {
    private val apiUrl = "/api/v1/messages"
    private val messageResponseMock = Message(
        message = "Some message text",
        email = "john@doe.com",
        sender = "John Doe",
        unread = false,
        id = "message-uuid"
    )

    @MockBean
    lateinit var messageService: MessageService

    @Test
    fun `Test getMessage should return status 200 if getMessage service function is successful`() {
        given(messageService.getById(messageResponseMock.id)).willReturn(messageResponseMock)

        mockMvc.get("${apiUrl}/${messageResponseMock.id}").andExpect {
            status { isOk() }
            jsonPath("$.status") { value(HttpStatus.OK.value()) }
            jsonPath("$.message") { value("Fetch message successful.") }
            jsonPath("$.data.id") { value(messageResponseMock.id) }
            jsonPath("$.data.sender") { value(messageResponseMock.sender) }
            jsonPath("$.data.email") { value(messageResponseMock.email) }
            jsonPath("$.data.unread") { value(messageResponseMock.unread) }
            jsonPath("$.data.message") { value(messageResponseMock.message) }
            jsonPath("$.data.createdAt") { isNotEmpty() }
            jsonPath("$.data.modifiedAt") { isNotEmpty() }
        }
    }

   /* @Test
    fun `Test getMessage should return `() {

        willThrow(NotFoundException("Message with id: (${messageResponseMock.id}) was not found!")).given(messageService).getById(messageResponseMock.id);

        mockMvc.get("${apiUrl}/${messageResponseMock.id}") {
            println()
        }.andExpect {
            status { isOk() }
            jsonPath("$.status") { value(HttpStatus.OK.value()) }
            jsonPath("$.message") { value("Fetch message successful.") }
            jsonPath("$.data.id") { value(messageResponseMock.id) }
            jsonPath("$.data.sender") { value(messageResponseMock.sender) }
            jsonPath("$.data.email") { value(messageResponseMock.email) }
            jsonPath("$.data.unread") { value(messageResponseMock.unread) }
            jsonPath("$.data.message") { value(messageResponseMock.message) }
            jsonPath("$.data.createdAt") { isNotEmpty() }
            jsonPath("$.data.modifiedAt") { isNotEmpty() }
        }
    }*/
}