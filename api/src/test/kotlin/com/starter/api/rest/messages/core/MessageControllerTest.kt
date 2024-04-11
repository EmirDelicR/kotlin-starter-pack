package com.starter.api.rest.messages.core

import com.starter.api.rest.messages.dtos.MessageRequest
import com.starter.api.testUtils.createPageObject
import com.starter.api.testUtils.sampleMessage
import com.starter.api.testUtils.withJsonContent
import com.starter.api.utils.PageableResolver
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.http.HttpStatus
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class MessageControllerTest() {
    private val apiUrl = "/api/v1/messages"
    private val messageResponseMock = sampleMessage()

    @MockBean
    private lateinit var messageRepository: MessageRepository

    @SpyBean
    private lateinit var messageService: MessageService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var messageController: MessageController

    @BeforeEach
    fun setUp() {
        messageService = MessageService(messageRepository)
        messageController = MessageController(messageService)
    }

    @Nested
    @DisplayName("getMessage Function")
    inner class GetMessage {
        @Test
        fun `Test getMessage should return status 200 if getMessage service function is successful`() {
            given(messageRepository.findMessageById(eq(messageResponseMock.id))).willReturn(messageResponseMock)

            mockMvc.get("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch message successful.") }
                jsonPath("$.data.id") { value(messageResponseMock.id) }
                jsonPath("$.data.sender") { value(messageResponseMock.sender) }
                jsonPath("$.data.email") { value(messageResponseMock.email) }
                jsonPath("$.data.unread") { value(messageResponseMock.unread) }
                jsonPath("$.data.message") { value(messageResponseMock.message) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getMessage should return status 404 if no item is found`() {
            given(messageRepository.findMessageById(eq(messageResponseMock.id))).willReturn(null)

            mockMvc.get("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Message with id: (${messageResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("getMessage/paginated Function")
    inner class GetMessagePaginated {
        @Test
        fun `Test getMessage paginated should return status 200 if findAll service function is successful with default values`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch messages was successful.") }
                jsonPath("$.data.totalCount") { value(1) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(1) }

                jsonPath("$.data.items[0].id") { value(messageResponseMock.id) }
                jsonPath("$.data.items[0].sender") { value(messageResponseMock.sender) }
                jsonPath("$.data.items[0].email") { value(messageResponseMock.email) }
                jsonPath("$.data.items[0].unread") { value(messageResponseMock.unread) }
                jsonPath("$.data.items[0].message") { value(messageResponseMock.message) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
                jsonPath("$.data.items[0].updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getMessage paginated should return status 200 if findAll service function is successful with passed values`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated?page=1&pageSize=1&columnId=createdAt&order=DESC").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch messages was successful.") }
                jsonPath("$.data.totalCount") { value(1) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(1) }

                jsonPath("$.data.items[0].id") { value(messageResponseMock.id) }
                jsonPath("$.data.items[0].sender") { value(messageResponseMock.sender) }
                jsonPath("$.data.items[0].email") { value(messageResponseMock.email) }
                jsonPath("$.data.items[0].unread") { value(messageResponseMock.unread) }
                jsonPath("$.data.items[0].message") { value(messageResponseMock.message) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
                jsonPath("$.data.items[0].updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getMessage paginated should return status 400 if page is less then 1`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated?page=0&pageSize=1&columnId=createdAt&order=DESC").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Page must be at least 1") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getMessage paginated should return status 400 if page is more then 100`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated?page=101&pageSize=1&columnId=createdAt&order=DESC").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Page must be less then 100") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getMessage paginated should return status 400 if pageSize is less then 0`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated?page=1&pageSize=0&columnId=createdAt&order=DESC").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("PageSize must be at least 1") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getMessage paginated should return status 400 if columnId is not correct`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            mockMvc.get("$apiUrl/paginated?page=1&pageSize=2&columnId=created&order=DESC").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath(
                    "$.message",
                ) { value("Cannot sort by created.Allowed sorting fields: ${PageableResolver.allowedOrderingParams.joinToString()}") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("saveMessage Function")
    inner class SaveMessage {
        @Test
        fun `Test saveMessage should return status 201 if saveMessage service function is successful`() {
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            val messageRequest =
                MessageRequest(
                    fullName = messageResponseMock.sender,
                    message = messageResponseMock.message,
                    email = messageResponseMock.email,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(messageRequest)
            }.andExpect {
                status { isCreated() }
                jsonPath("$.status") { value(HttpStatus.CREATED.value()) }
                jsonPath("$.message") { value("Message was send successful.") }
                jsonPath("$.data.id") { value(messageResponseMock.id) }
                jsonPath("$.data.sender") { value(messageResponseMock.sender) }
                jsonPath("$.data.email") { value(messageResponseMock.email) }
                jsonPath("$.data.unread") { value(messageResponseMock.unread) }
                jsonPath("$.data.message") { value(messageResponseMock.message) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test saveMessage should return status 400 if fullName is blank`() {
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            val messageRequest =
                MessageRequest(
                    fullName = "",
                    message = messageResponseMock.message,
                    email = messageResponseMock.email,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(messageRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Full name must not be blank!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test saveMessage should return status 400 if message is blank`() {
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            val messageRequest =
                MessageRequest(
                    fullName = messageResponseMock.sender,
                    message = "",
                    email = messageResponseMock.email,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(messageRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Message must not be blank!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test saveMessage should return status 400 if email is blank`() {
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            val messageRequest =
                MessageRequest(
                    fullName = messageResponseMock.sender,
                    message = messageResponseMock.message,
                    email = "",
                )

            mockMvc.post(apiUrl) {
                withJsonContent(messageRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Email is not valid!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test saveMessage should return status 400 if email is not valid`() {
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            val messageRequest =
                MessageRequest(
                    fullName = messageResponseMock.sender,
                    message = messageResponseMock.message,
                    email = "t@t",
                )

            mockMvc.post(apiUrl) {
                withJsonContent(messageRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Email is not valid!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("deleteMessage Function")
    inner class DeleteMessage {
        @Test
        fun `Test deleteMessage should return status 200 if deleteMessage service function is successful`() {
            given(messageRepository.existsById(eq(messageResponseMock.id))).willReturn(true)

            mockMvc.delete("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Message with id: (${messageResponseMock.id}) was deleted successfully.") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test deleteMessage should return status 404 if no item is found`() {
            given(messageRepository.existsById(eq(messageResponseMock.id))).willReturn(false)

            mockMvc.delete("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Message with id: (${messageResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("updateMessage Function")
    inner class UpdateMessage {
        @Test
        fun `Test updateMessage should return status 200 if updateMessage service function is successful`() {
            given(messageRepository.findMessageById(eq(messageResponseMock.id))).willReturn(messageResponseMock)
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            mockMvc.put("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Message with id (${messageResponseMock.id}) was updated successfully.") }
                jsonPath("$.data.id") { value(messageResponseMock.id) }
                jsonPath("$.data.sender") { value(messageResponseMock.sender) }
                jsonPath("$.data.email") { value(messageResponseMock.email) }
                jsonPath("$.data.unread") { value(messageResponseMock.unread) }
                jsonPath("$.data.message") { value(messageResponseMock.message) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test updateMessage should return status 404 if no item is found`() {
            given(messageRepository.findMessageById(eq(messageResponseMock.id))).willReturn(null)

            mockMvc.put("$apiUrl/${messageResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Message with id: (${messageResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }
}
