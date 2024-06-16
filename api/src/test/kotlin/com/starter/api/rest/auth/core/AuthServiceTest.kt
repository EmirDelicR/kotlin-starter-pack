package com.starter.api.rest.auth.core

import com.starter.api.config.DataLoader
import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.subscriptions.core.SubscriptionService
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.sampleLoginUserRequest
import com.starter.api.testUtils.sampleRegisterUserRequest
import com.starter.api.testUtils.sampleRole
import com.starter.api.testUtils.sampleUser
import com.starter.api.utils.JWTHandler
import com.starter.api.utils.PasswordEncoder
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatCode
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.times
import org.mockito.BDDMockito.verify
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.argForWhich
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean
import java.util.Date

@SpringBootTest
@AutoConfigureMockMvc
class AuthServiceTest {
    private val role = sampleRole().copy()
    private val user = sampleUser().copy()

    private var userRepository = mock<UserRepository>()
    private var roleRepository = mock<RoleRepository>()

    @SpyBean
    private lateinit var userService: UserService

    @SpyBean
    private lateinit var roleService: RoleService

    @SpyBean
    private lateinit var subscriptionService: SubscriptionService

    @SpyBean
    private lateinit var authService: AuthService

    @SpyBean
    private lateinit var jwtHandler: JWTHandler

    @MockBean
    private lateinit var dataLoader: DataLoader

    @BeforeEach
    fun setUp() {
        roleService = RoleService(roleRepository)
        userService = UserService(userRepository, roleService, subscriptionService)
        authService = AuthService(userService, roleService, jwtHandler)
    }

    @Nested
    @DisplayName("registerUser Function")
    inner class RegisterUser {
        private val registerRequest = sampleRegisterUserRequest().copy()

        @Test
        fun `Test registerUser should return status 201 if service function is successful`() {
            given(roleRepository.getRoleByType(eq(RoleType.USER))).willReturn(role)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val response = authService.registerUser(registerRequest)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.email == registerRequest.email && this.loggedIn && !this.subscribed &&
                        this.firstName == registerRequest.firstName &&
                        this.lastName == registerRequest.lastName &&
                        this.userName == registerRequest.userName &&
                        !this.profileUpdated
                },
            )

            assertThat(response).hasFieldOrProperty("token")
            assertThat(response).hasFieldOrProperty("user")
        }

        @Test
        fun `Test registerUser should return status 409 if user is already register`() {
            given(userRepository.findUserByEmail(eq(registerRequest.email))).willReturn(user)

            assertThatCode {
                authService.registerUser(registerRequest)
            }.hasMessage("User with email: (${registerRequest.email}) was already register!")
                .isInstanceOf(ConflictException::class.java)
        }

        @Test
        fun `Test registerUser should return status 404 if user role do not exists`() {
            assertThatCode {
                authService.registerUser(registerRequest)
            }.hasMessage("Role with type: (USER) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }
    }

    @Nested
    @DisplayName("loginUser Function")
    inner class LoginUser {
        private val loginRequest = sampleLoginUserRequest().copy()

        @Test
        fun `Test loginUser should return status 404 if user do not exists`() {
            given(userRepository.findUserByEmail(loginRequest.email)).willReturn(null)

            assertThatCode {
                authService.loginUser(loginRequest)
            }.hasMessage("User with email: (${loginRequest.email}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `Test loginUser should return status 400 if user password do not match`() {
            given(userRepository.findUserByEmail(loginRequest.email)).willReturn(user)

            assertThatCode {
                authService.loginUser(loginRequest)
            }.hasMessage("Unfortunately password is not valid. Please try again and check password that you input!")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `Test loginUser should login user successfully`() {
            val userWithCorrectPassword = user.copy(password = PasswordEncoder.hashPassword("Test123!"))
            given(userRepository.findUserByEmail(loginRequest.email)).willReturn(userWithCorrectPassword)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val response = authService.loginUser(loginRequest)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.loggedIn
                },
            )

            assertThat(response).hasFieldOrProperty("token")
            assertThat(response).hasFieldOrProperty("user")
        }
    }

    @Nested
    @DisplayName("autoLoginUser Function")
    inner class AutoLoginUser {
        @Test
        fun `Test autoLoginUser should return status 400 if token is expired`() {
            Mockito.`when`(jwtHandler.generateExpirationTime(any())).thenReturn(Date(1615001631))
            val token = jwtHandler.generateJwtToken("test@test.com")

            assertThatCode {
                authService.autoLoginUser(token)
            }.hasMessage("This token is expired. Please login again!")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `Test autoLoginUser should return status 400 if user email is not in token`() {
            val token = jwtHandler.generateJwtToken("test@test.com")
            Mockito.`when`(jwtHandler.getUserEmailFromJwtToken(token)).thenReturn(null)

            assertThatCode {
                authService.autoLoginUser(token)
            }.hasMessage("This token is not valid. Please login again!")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `Test autoLoginUser should return status 404 if user with email is not found`() {
            val email = "test@test.com"
            val token = jwtHandler.generateJwtToken(email)
            given(userRepository.findUserByEmail(email)).willReturn(null)

            assertThatCode {
                authService.autoLoginUser(token)
            }.hasMessage("User with email: ($email) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `Test autoLoginUser should auto login user successfully`() {
            val email = "test@test.com"
            val token = jwtHandler.generateJwtToken(email)
            given(userRepository.findUserByEmail(email)).willReturn(sampleUser())
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val response = authService.autoLoginUser(token)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.loggedIn
                },
            )

            assertThat(response).hasFieldOrProperty("token")
            assertThat(response).hasFieldOrProperty("user")
        }
    }

    @Nested
    @DisplayName("updateToken Function")
    inner class UpdateToken {
        @Test
        fun `Test updateToken should return status 400 if token is expired`() {
            Mockito.`when`(jwtHandler.generateExpirationTime(any())).thenReturn(Date(1615001631))
            val token = jwtHandler.generateJwtToken("test@test.com")

            assertThatCode {
                authService.updateToken(token)
            }.hasMessage("This token is not valid. Please login again!")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `Test updateToken should return status 400 if user email is not in token`() {
            val token = jwtHandler.generateJwtToken("test@test.com")
            Mockito.`when`(jwtHandler.getUserEmailFromJwtToken(token)).thenReturn(null)

            assertThatCode {
                authService.updateToken(token)
            }.hasMessage("This token is not valid. Please login again!")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `Test updateToken should return status 404 if user with email is not found`() {
            val email = "test@test.com"
            val token = jwtHandler.generateJwtToken(email)
            given(userRepository.findUserByEmail(email)).willReturn(null)

            assertThatCode {
                authService.updateToken(token)
            }.hasMessage("User with email: ($email) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `Test updateToken should update user token successfully`() {
            val email = "test@test.com"
            val token = jwtHandler.generateJwtToken(email)
            given(userRepository.findUserByEmail(email)).willReturn(sampleUser())
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val response = authService.updateToken(token)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(any())

            assertThat(response).isNotEmpty()
        }
    }
}
