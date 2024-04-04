package com.starter.api.rest.auth.core

import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.sampleRegisterUserRequest
import com.starter.api.testUtils.sampleRole
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
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    private val apiUrl = "/api/v1"
    private val role = sampleRole().copy()
    private val user = sampleUser().copy()

    @MockBean
    private lateinit var userRepository: UserRepository

    @SpyBean
    private lateinit var userService: UserService

    @MockBean
    private lateinit var roleRepository: RoleRepository

    @SpyBean
    private lateinit var roleService: RoleService

    @SpyBean
    private lateinit var authService: AuthService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var authController: AuthController

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
        roleService = RoleService(roleRepository)
        authService = AuthService(userService, roleService)
        authController = AuthController(authService)
    }

    @Nested
    @DisplayName("registerUser Function")
    inner class RegisterUser {
        private val registerRequest = sampleRegisterUserRequest().copy()

        @Test
        fun `Test registerUser should return status 201 if service function is successful`() {
            given(roleRepository.getRoleByType(eq(RoleType.USER))).willReturn(role)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            mockMvc.post("$apiUrl/register") {
                withJsonContent(registerRequest)
            }.andExpect {
                status { isCreated() }
                jsonPath("$.status") { value(HttpStatus.CREATED.value()) }
                jsonPath("$.message") { value("User is register successfully.") }
                jsonPath("$.data.id") { isNotEmpty() }
                jsonPath("$.data.email") { value(registerRequest.email) }
                jsonPath("$.data.role.type") { value(RoleType.USER.toString()) }
                jsonPath("$.data.firstName") { value(registerRequest.firstName) }
                jsonPath("$.data.lastName") { value(registerRequest.lastName) }
                jsonPath("$.data.userName") { value(registerRequest.userName) }
                jsonPath("$.data.loggedIn") { value(true) }
                jsonPath("$.data.profileUpdated") { value(false) }
                jsonPath("$.data.subscribed") { value(false) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 400 if password in request is not valid`() {
            val updateRegisterRequest = registerRequest.copy(password = "test")

            mockMvc.post("$apiUrl/register") {
                withJsonContent(updateRegisterRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Password is not strong enough!(min 8 char | number | special char)") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 400 if email in request is not valid`() {
            val updateRegisterRequest = registerRequest.copy(email = "test")

            mockMvc.post("$apiUrl/register") {
                withJsonContent(updateRegisterRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Email is not valid!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 400 if firstName is blank`() {
            val updateRegisterRequest = registerRequest.copy(firstName = " ")

            mockMvc.post("$apiUrl/register") {
                withJsonContent(updateRegisterRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("First name must not be blank!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 400 if lastName is blank`() {
            val updateRegisterRequest = registerRequest.copy(lastName = " ")

            mockMvc.post("$apiUrl/register") {
                withJsonContent(updateRegisterRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Last name must not be blank!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 409 if user is already register`() {
            given(userRepository.findUserByEmail(eq(registerRequest.email))).willReturn(user)

            mockMvc.post("$apiUrl/register") {
                withJsonContent(registerRequest)
            }.andExpect {
                status { isConflict() }
                jsonPath("$.status") { value(HttpStatus.CONFLICT.value()) }
                jsonPath("$.message") { value("User with email: (${registerRequest.email}) was already register!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test registerUser should return status 404 if user role do not exists`() {
            mockMvc.post("$apiUrl/register") {
                withJsonContent(registerRequest)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Role with type: (USER) was not found!") }
                jsonPath("$.data") { isEmpty() }
            }
        }
    }
}
