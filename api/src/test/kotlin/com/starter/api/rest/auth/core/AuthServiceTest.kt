package com.starter.api.rest.auth.core

import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.enums.RoleType
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
import org.mockito.kotlin.any
import org.mockito.kotlin.argForWhich
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.SpyBean

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
    private lateinit var authService: AuthService

    @SpyBean
    private lateinit var jwtHandler: JWTHandler

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
        roleService = RoleService(roleRepository)
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
        fun `Test loginUser should `() {
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
}
