package com.starter.api.rest.auth.core

import com.starter.api.exception.ConflictException
import com.starter.api.exception.NotFoundException
import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.sampleRegisterUserRequest
import com.starter.api.testUtils.sampleRole
import com.starter.api.testUtils.sampleUser
import org.assertj.core.api.Assertions.assertThatCode
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.verify
import org.mockito.BDDMockito.times
import org.mockito.BDDMockito.given
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


    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
        roleService = RoleService(roleRepository)
        authService = AuthService(userService, roleService)
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

            assertThat(response).isNotNull()
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
}