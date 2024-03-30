package com.starter.api.rest.users.core

import com.starter.api.exception.NotFoundException
import com.starter.api.testUtils.sampleUpdateUserRequest
import com.starter.api.testUtils.sampleUser
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
import org.mockito.kotlin.mock

@DisplayName("UserService test")
class UserServiceTest {
    private val userResponseMock = sampleUser()
    private lateinit var userService: UserService
    private val userRepository = mock<UserRepository>()

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
    }

    @Nested
    @DisplayName("getById Function")
    inner class GetById {
        @Test
        fun `should return user if is found in DB`() {
            given(userRepository.findUserById(userResponseMock.id)).willReturn(userResponseMock)
            assertThat(userService.getById(userResponseMock.id)).isEqualTo(userResponseMock)
        }

        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(userRepository.findUserById(userResponseMock.id)).willReturn(null)

            assertThatCode {
                userService.getById(userResponseMock.id)
            }.hasMessage("User with id: (${userResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }
    }

    @Nested
    @DisplayName("update Function")
    inner class Update {
        private val updateUserRequest = sampleUpdateUserRequest()

        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(userRepository.findUserById(userResponseMock.id)).willReturn(null)

            assertThatCode {
                userService.update(userResponseMock.id, updateUserRequest)
            }.hasMessage("User with id: (${userResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return updated user if is found in DB`() {
            given(userRepository.findUserById(userResponseMock.id)).willReturn(userResponseMock)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            userService.update(userResponseMock.id, updateUserRequest)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.age == updateUserRequest.age &&
                        this.firstName == updateUserRequest.firstName &&
                        this.lastName == updateUserRequest.lastName &&
                        this.subscribed && this.avatar == updateUserRequest.avatar &&
                        this.profileUpdated && this.userName == updateUserRequest.userName
                },
            )
        }

        @Test
        fun `should return userName from DB if userName is not passed in request`() {
            val updateUserMock = userResponseMock.copy(userName = "Test User")
            given(userRepository.findUserById(userResponseMock.id)).willReturn(updateUserMock)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val updateUserRequestUpdated = updateUserRequest.copy(userName = "")

            userService.update(userResponseMock.id, updateUserRequestUpdated)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.profileUpdated && this.userName == updateUserMock.userName
                },
            )
        }

        @Test
        fun `should return userName from firstName and lastName if userName is not passed in request and not in DB`() {
            val updateUserMock = userResponseMock.copy(userName = "")
            given(userRepository.findUserById(userResponseMock.id)).willReturn(updateUserMock)
            given(userRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            val updateUserRequestUpdated = updateUserRequest.copy(userName = "", firstName = "Test", lastName = "User")

            userService.update(userResponseMock.id, updateUserRequestUpdated)

            verify(
                userRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.profileUpdated && this.userName == "Test User"
                },
            )
        }
    }
}
