package com.starter.api.rest.users.core

import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.testUtils.sampleUpdateUserRequest
import com.starter.api.testUtils.sampleUser
import com.starter.api.testUtils.withJsonContent
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
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    private val apiUrl = "/api/v1/users"
    private val userResponseMock = sampleUser()

    @MockBean
    private lateinit var userRepository: UserRepository

    @SpyBean
    private lateinit var userService: UserService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var userController: UserController

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
        userController = UserController(userService)
    }

    @Nested
    @DisplayName("getUser Function")
    inner class GetUser {
        @Test
        fun `Test getUser should return status 200 if service function is successful`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(userResponseMock)

            mockMvc.get("$apiUrl/${userResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch user successful.") }
                jsonPath("$.data.id") { value(userResponseMock.id) }
                jsonPath("$.data.email") { value(userResponseMock.email) }
                jsonPath("$.data.role") { value("ADMIN") }
                jsonPath("$.data.age") { value(userResponseMock.age) }
                jsonPath("$.data.avatar") { value(userResponseMock.avatar) }
                jsonPath("$.data.firstName") { value(userResponseMock.firstName) }
                jsonPath("$.data.lastName") { value(userResponseMock.lastName) }
                jsonPath("$.data.userName") { value(userResponseMock.userName) }
                jsonPath("$.data.token") { value(userResponseMock.token) }
                jsonPath("$.data.loggedIn") { value(userResponseMock.loggedIn) }
                jsonPath("$.data.profileUpdated") { value(userResponseMock.profileUpdated) }
                jsonPath("$.data.subscribed") { value(userResponseMock.subscribed) }
                jsonPath("$.data.subscriptions") { arrayOf(SubscriptionType.GENERAL) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getMessage should return status 404 if no item is found`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(null)

            mockMvc.get("$apiUrl/${userResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with id: (${userResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("updateUser Function")
    inner class UpdateUser {
        private val updateUserRequest = sampleUpdateUserRequest()

        @Test
        fun `Test updateUser should return status 200 if service function is successful`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(userResponseMock)
            given(userRepository.saveAndFlush(any())).willReturn(userResponseMock)

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequest)
            }.andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("User with id (${userResponseMock.id}) was updated successfully.") }
                jsonPath("$.data.id") { value(userResponseMock.id) }
                jsonPath("$.data.email") { value(userResponseMock.email) }
                jsonPath("$.data.role") { value("ADMIN") }
                jsonPath("$.data.age") { value(userResponseMock.age) }
                jsonPath("$.data.avatar") { value(userResponseMock.avatar) }
                jsonPath("$.data.firstName") { value(userResponseMock.firstName) }
                jsonPath("$.data.lastName") { value(userResponseMock.lastName) }
                jsonPath("$.data.userName") { value(userResponseMock.userName) }
                jsonPath("$.data.token") { value(userResponseMock.token) }
                jsonPath("$.data.loggedIn") { value(userResponseMock.loggedIn) }
                jsonPath("$.data.profileUpdated") { value(userResponseMock.profileUpdated) }
                jsonPath("$.data.subscribed") { value(userResponseMock.subscribed) }
                jsonPath("$.data.subscriptions") { arrayOf(SubscriptionType.GENERAL) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test updateUser should return status 400 if age is not positive number`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(userResponseMock)
            given(userRepository.saveAndFlush(any())).willReturn(userResponseMock)

            val updateUserRequestUpdated = updateUserRequest.copy(age = -1)

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequestUpdated)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Age must be positive number!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test updateUser should return status 400 if firstName is blank`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(userResponseMock)
            given(userRepository.saveAndFlush(any())).willReturn(userResponseMock)

            val updateUserRequestUpdated = updateUserRequest.copy(firstName = "")

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequestUpdated)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("First name must not be blank!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test updateUser should return status 400 if lastName is blank`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(userResponseMock)
            given(userRepository.saveAndFlush(any())).willReturn(userResponseMock)

            val updateUserRequestUpdated = updateUserRequest.copy(lastName = "")

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequestUpdated)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Last name must not be blank!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test updateUser should set user name from first and last name`() {
            val updatedResponse = userResponseMock.copy(userName = "")

            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(updatedResponse)
            given(userRepository.saveAndFlush(any())).willReturn(updatedResponse)

            val updateUserRequestUpdated = updateUserRequest.copy(userName = "", firstName = "Test", lastName = "User")

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequestUpdated)
            }.andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("User with id (${userResponseMock.id}) was updated successfully.") }
                jsonPath("$.data.id") { value(userResponseMock.id) }
                jsonPath("$.data.email") { value(userResponseMock.email) }
                jsonPath("$.data.role") { value("ADMIN") }
                jsonPath("$.data.age") { value(updateUserRequestUpdated.age) }
                jsonPath("$.data.avatar") { value(userResponseMock.avatar) }
                jsonPath("$.data.firstName") { value(updateUserRequestUpdated.firstName) }
                jsonPath("$.data.lastName") { value(updateUserRequestUpdated.lastName) }
                jsonPath("$.data.userName") { value("Test User") }
                jsonPath("$.data.token") { value(userResponseMock.token) }
                jsonPath("$.data.loggedIn") { value(userResponseMock.loggedIn) }
                jsonPath("$.data.profileUpdated") { value(true) }
                jsonPath("$.data.subscribed") { value(true) }
                jsonPath("$.data.subscriptions") { arrayOf(SubscriptionType.GENERAL) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test updateUser should return status 404 if no user is found`() {
            given(userRepository.findUserById(eq(userResponseMock.id))).willReturn(null)

            mockMvc.put("$apiUrl/${userResponseMock.id}") {
                withJsonContent(updateUserRequest)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with id: (${userResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }
}
