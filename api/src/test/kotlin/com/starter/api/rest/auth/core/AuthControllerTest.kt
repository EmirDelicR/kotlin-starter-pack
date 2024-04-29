package com.starter.api.rest.auth.core

import com.starter.api.rest.auth.dtos.TokenRequest
import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.sampleLoginUserRequest
import com.starter.api.testUtils.sampleRegisterUserRequest
import com.starter.api.testUtils.sampleRole
import com.starter.api.testUtils.sampleUser
import com.starter.api.testUtils.withJsonContent
import com.starter.api.utils.JWTHandler
import com.starter.api.utils.PasswordEncoder
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
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
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

    @MockBean
    private lateinit var jwtHandler: JWTHandler

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var authController: AuthController

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
        roleService = RoleService(roleRepository)
        authService = AuthService(userService, roleService, jwtHandler)
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
                header { exists(HttpHeaders.SET_COOKIE) }
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

    @Nested
    @DisplayName("loginUser Function")
    inner class LoginUser {
        private val loginRequest = sampleLoginUserRequest().copy()

        @Test
        fun `Test loginUser should return status 201 if service function is successful`() {
            val userWithCorrectPassword = user.copy(password = PasswordEncoder.hashPassword("Test123!"))
            given(userRepository.findUserByEmail(loginRequest.email)).willReturn(userWithCorrectPassword)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }
            given(jwtHandler.generateJwtToken(any(), any())).willReturn("generatedToken")

            mockMvc.post("$apiUrl/login") {
                withJsonContent(loginRequest)
            }.andExpect {
                header { exists(HttpHeaders.SET_COOKIE) }
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("User was logged in successfully.") }
                jsonPath("$.data.id") { isNotEmpty() }
                jsonPath("$.data.email") { value(user.email) }
                jsonPath("$.data.role.type") { value(RoleType.USER.toString()) }
                jsonPath("$.data.firstName") { value(user.firstName) }
                jsonPath("$.data.lastName") { value(user.lastName) }
                jsonPath("$.data.userName") { value(user.userName) }
                jsonPath("$.data.loggedIn") { value(true) }
                jsonPath("$.data.profileUpdated") { value(false) }
                jsonPath("$.data.subscribed") { value(true) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test loginUser should return status 400 if password in request is blank`() {
            val updateLoginRequest = loginRequest.copy(password = "")

            mockMvc.post("$apiUrl/login") {
                withJsonContent(updateLoginRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Password must not be blank!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test loginUser should return status 400 if email in request is not valid`() {
            val updateLoginRequest = loginRequest.copy(email = "test")

            mockMvc.post("$apiUrl/login") {
                withJsonContent(updateLoginRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Email is not valid!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test loginUser should return status 404 if user do not exists`() {
            mockMvc.post("$apiUrl/login") {
                withJsonContent(loginRequest)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with email: (${loginRequest.email}) was not found!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test loginUser should return status 400 if password do not match`() {
            val userWithIncorrectPassword = user.copy(password = PasswordEncoder.hashPassword("Wrong!"))
            given(userRepository.findUserByEmail(loginRequest.email)).willReturn(userWithIncorrectPassword)

            mockMvc.post("$apiUrl/login") {
                withJsonContent(loginRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Unfortunately password is not valid. Please try again and check password that you input!") }
                jsonPath("$.data") { isEmpty() }
            }
        }
    }

    @Nested
    @DisplayName("autoLoginUser Function")
    inner class AutoLoginUser {
        @Test
        fun `Test autoLoginUser should return status 400 if token in request is blank`() {
            val token = TokenRequest("")

            mockMvc.post("$apiUrl/autoLogin") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Token must not be blank!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test autoLoginUser should return status 400 if token in expired`() {
            val tokenValue = "SomeToken"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(true)

            mockMvc.post("$apiUrl/autoLogin") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("This token is not valid. Please login again!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test autoLoginUser should return status 400 if email is not in token`() {
            val tokenValue = "SomeToken"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(null)

            mockMvc.post("$apiUrl/autoLogin") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("This token is not valid. Please login again!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test autoLoginUser should return status 404 if user is not found`() {
            val tokenValue = "SomeToken"
            val email = "test@test.com"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(email)

            mockMvc.post("$apiUrl/autoLogin") {
                withJsonContent(token)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with email: ($email) was not found!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test autoLoginUser should successfully auto login user`() {
            val tokenValue = "SomeToken"
            val email = "test@test.com"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(email)
            given(userRepository.findUserByEmail(eq(email))).willReturn(user)
            given(jwtHandler.generateJwtToken(any(), any())).willReturn("generatedToken")
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            mockMvc.post("$apiUrl/autoLogin") {
                withJsonContent(token)
            }.andExpect {
                header { exists(HttpHeaders.SET_COOKIE) }
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("User was logged in successfully.") }
                jsonPath("$.data.id") { isNotEmpty() }
                jsonPath("$.data.email") { value(user.email) }
                jsonPath("$.data.role.type") { value(RoleType.USER.toString()) }
                jsonPath("$.data.firstName") { value(user.firstName) }
                jsonPath("$.data.lastName") { value(user.lastName) }
                jsonPath("$.data.userName") { value(user.userName) }
                jsonPath("$.data.loggedIn") { value(true) }
                jsonPath("$.data.profileUpdated") { value(false) }
                jsonPath("$.data.subscribed") { value(true) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
                jsonPath("$.data.updatedAt") { isNotEmpty() }
            }
        }
    }

    @Nested
    @DisplayName("updateToken Function")
    inner class UpdateToken {
        @Test
        fun `Test updateToken should return status 400 if token in request is blank`() {
            val token = TokenRequest("")

            mockMvc.put("$apiUrl/refresh") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Token must not be blank!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test updateToken should return status 400 if token in expired`() {
            val tokenValue = "SomeToken"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(true)

            mockMvc.put("$apiUrl/refresh") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("This token is not valid. Please login again!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test updateToken should return status 400 if email is not in token`() {
            val tokenValue = "SomeToken"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(null)

            mockMvc.put("$apiUrl/refresh") {
                withJsonContent(token)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("This token is not valid. Please login again!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test updateToken should return status 404 if user is not found`() {
            val tokenValue = "SomeToken"
            val email = "test@test.com"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(email)

            mockMvc.put("$apiUrl/refresh") {
                withJsonContent(token)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with email: ($email) was not found!") }
                jsonPath("$.data") { isEmpty() }
            }
        }

        @Test
        fun `Test updateToken should successfully update token`() {
            val tokenValue = "SomeToken"
            val email = "test@test.com"
            val token = TokenRequest(tokenValue)
            given(jwtHandler.isTokenExpired(eq(tokenValue))).willReturn(false)
            given(jwtHandler.getUserEmailFromJwtToken(eq(tokenValue))).willReturn(email)
            given(userRepository.findUserByEmail(eq(email))).willReturn(user)
            given(jwtHandler.generateJwtToken(any(), any())).willReturn("generatedToken")
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            mockMvc.put("$apiUrl/refresh") {
                withJsonContent(token)
            }.andExpect {
                header { exists(HttpHeaders.SET_COOKIE) }
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Token was refreshed successfully.") }
                jsonPath("$.data") { isNotEmpty() }
            }
        }
    }
}
