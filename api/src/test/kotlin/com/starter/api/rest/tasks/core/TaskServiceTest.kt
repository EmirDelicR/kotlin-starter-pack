package com.starter.api.rest.tasks.core

import com.starter.api.config.DataLoader
import com.starter.api.exception.NotFoundException
import com.starter.api.rest.roles.core.RoleRepository
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.subscriptions.core.SubscriptionRepository
import com.starter.api.rest.subscriptions.core.SubscriptionService
import com.starter.api.rest.tasks.dtos.TaskRequest
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.createPageObject
import com.starter.api.testUtils.sampleTask
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
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean

class TaskServiceTest {
    private val taskResponseMock = sampleTask()
    private val userSample = sampleUser()

    private val userRepository = mock<UserRepository>()
    private val taskRepository = mock<TaskRepository>()
    private var roleRepository = mock<RoleRepository>()
    private var subscriptionRepository = mock<SubscriptionRepository>()

    @MockBean
    private lateinit var dataLoader: DataLoader

    @SpyBean
    private lateinit var userService: UserService

    @SpyBean
    private lateinit var roleService: RoleService

    @SpyBean
    private lateinit var taskService: TaskService

    @SpyBean
    private lateinit var subscriptionService: SubscriptionService

    @BeforeEach
    fun setUp() {
        subscriptionService = SubscriptionService(subscriptionRepository)
        roleService = RoleService(roleRepository)
        userService = UserService(userRepository, roleService, subscriptionService)
        taskService = TaskService(taskRepository, userService)
    }

    @Nested
    @DisplayName("getById Function")
    inner class GetById {
        @Test
        fun `should return task if is found in DB`() {
            given(taskRepository.findTasksById(taskResponseMock.id)).willReturn(taskResponseMock)
            assertThat(taskService.getById(taskResponseMock.id)).isEqualTo(taskResponseMock)
        }

        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(taskRepository.findTasksById(taskResponseMock.id)).willReturn(null)

            assertThatCode {
                taskService.getById(taskResponseMock.id)
            }.hasMessage("Task with id: (${taskResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }
    }

    @Nested
    @DisplayName("findAllByUserId Function")
    inner class FindAllByUserId {
        @Test
        fun `should throw exception if user is not found`() {
            given(userRepository.findUserById(userSample.id)).willReturn(null)
            assertThatCode {
                taskService.findAllByUserId(userId = userSample.id, 0, 1, false)
            }.hasMessage("User with id: (${userSample.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should call taskRepository countAllByUserId method and return data`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.findAndCount(eq(userSample.id), any()))
                .willReturn(createPageObject(listOf(taskResponseMock)))

            val response = taskService.findAllByUserId(userId = userSample.id, 1, 1, false)

            assertThat(response.totalCount).isEqualTo(1)
            assertThat(response.numberOfPages).isEqualTo(1)
            assertThat(response.items.size).isEqualTo(1)
            assertThat(response.items[0]).isEqualTo(taskResponseMock.toResponse())
        }

        @Test
        fun `should call taskRepository countAllByUserId method and return multiple page`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.findAndCount(eq(userSample.id), any()))
                .willReturn(createPageObject(listOf(taskResponseMock, taskResponseMock), 1))

            val response = taskService.findAllByUserId(userId = userSample.id, 2, 1, false)

            assertThat(response.totalCount).isEqualTo(2)
            assertThat(response.numberOfPages).isEqualTo(2)
            assertThat(response.items.size).isEqualTo(2)
            assertThat(response.items[0]).isEqualTo(taskResponseMock.toResponse())
        }

        @Test
        fun `should call taskRepository countAllByUserId method and return all data if is mobile`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.findAndCount(eq(userSample.id), any()))
                .willReturn(createPageObject(listOf(taskResponseMock, taskResponseMock, taskResponseMock), 1))

            val response = taskService.findAllByUserId(userId = userSample.id, 1, 5, true)

            assertThat(response.totalCount).isEqualTo(3)
            assertThat(response.numberOfPages).isEqualTo(3)
            assertThat(response.items.size).isEqualTo(3)
            assertThat(response.items[0]).isEqualTo(taskResponseMock.toResponse())
        }
    }

    @Nested
    @DisplayName("getTaskStatistics Function")
    inner class GetTaskStatistics {
        @Test
        fun `should throw exception if user is not found`() {
            given(userRepository.findUserById(userSample.id)).willReturn(null)
            assertThatCode {
                taskService.getTaskStatistics(userId = userSample.id)
            }.hasMessage("User with id: (${userSample.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return data all 0 if no task`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.findAllByUserId(eq(userSample.id))).willReturn(listOf())

            val response = taskService.getTaskStatistics(userId = userSample.id)

            assertThat(response.total).isEqualTo(0)
            assertThat(response.done).isEqualTo(0)
            assertThat(response.open).isEqualTo(0)
        }

        @Test
        fun `should return data if task are set`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.findAllByUserId(eq(userSample.id))).willReturn(listOf(taskResponseMock))

            val response = taskService.getTaskStatistics(userId = userSample.id)

            assertThat(response.total).isEqualTo(1)
            assertThat(response.done).isEqualTo(0)
            assertThat(response.open).isEqualTo(1)
        }

        @Test
        fun `should correctly calculate statistics`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(
                taskRepository.findAllByUserId(eq(userSample.id)),
            ).willReturn(listOf(taskResponseMock, taskResponseMock.copy(completed = true)))

            val response = taskService.getTaskStatistics(userId = userSample.id)

            assertThat(response.total).isEqualTo(2)
            assertThat(response.done).isEqualTo(1)
            assertThat(response.open).isEqualTo(1)
        }
    }

    @Nested
    @DisplayName("create Function")
    inner class Create {
        @Test
        fun `should create task and store it to DB`() {
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)

            val taskRequest = TaskRequest("New title", userSample.id)

            taskService.create(taskRequest)

            verify(
                taskRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    !this.completed && this.title == "New title"
                },
            )
        }

        @Test
        fun `should not create task and if no user`() {
            given(userRepository.findUserById(userSample.id)).willReturn(null)
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)

            val taskRequest = TaskRequest("New title", userSample.id)

            assertThatCode {
                taskService.create(taskRequest)
            }.hasMessage("User with id: (${userSample.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)

            verify(
                taskRepository,
                times(0),
            ).saveAndFlush(
                any(),
            )
        }
    }

    @Nested
    @DisplayName("remove Function")
    inner class Remove {
        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(taskRepository.existsById(taskResponseMock.id)).willReturn(false)

            assertThatCode {
                taskService.remove(taskResponseMock.id)
            }.hasMessage("Task with id: (${taskResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return message if is found in DB`() {
            given(taskRepository.existsById(taskResponseMock.id)).willReturn(true)
            doNothing().`when`(taskRepository).deleteById(taskResponseMock.id)

            taskService.remove(taskResponseMock.id)

            verify(
                taskRepository,
                times(1),
            ).deleteById(
                argForWhich {
                    this == taskResponseMock.id
                },
            )
        }
    }

    @Nested
    @DisplayName("update Function")
    inner class Update {
        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(taskRepository.findTasksById(taskResponseMock.id)).willReturn(null)

            assertThatCode {
                taskService.update(taskResponseMock.id)
            }.hasMessage("Task with id: (${taskResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return updated message if is found in DB`() {
            given(taskRepository.findTasksById(taskResponseMock.id)).willReturn(taskResponseMock)
            given(taskRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            taskService.update(taskResponseMock.id)

            verify(
                taskRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.completed
                },
            )
        }
    }
}
