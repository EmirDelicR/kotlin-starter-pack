package com.starter.api.rest.tasks.core

import com.starter.api.config.DataLoader
import com.starter.api.rest.roles.core.RoleService
import com.starter.api.rest.subscriptions.core.SubscriptionService
import com.starter.api.rest.tasks.dtos.TaskRequest
import com.starter.api.rest.users.core.UserRepository
import com.starter.api.rest.users.core.UserService
import com.starter.api.testUtils.createPageObject
import com.starter.api.testUtils.sampleTask
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
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class TaskControllerTest {
    private val apiUrl = "/api/v1/tasks"
    private val taskResponseMock = sampleTask()
    private val userSample = sampleUser()

    @MockBean
    private lateinit var taskRepository: TaskRepository

    @MockBean
    private lateinit var userRepository: UserRepository

    @SpyBean
    private lateinit var roleService: RoleService

    @SpyBean
    private lateinit var subscriptionService: SubscriptionService

    @SpyBean
    private lateinit var taskService: TaskService

    @SpyBean
    private lateinit var userService: UserService

    @MockBean
    private lateinit var dataLoader: DataLoader

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var taskController: TaskController

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository, roleService, subscriptionService)
        taskService = TaskService(taskRepository, userService)
        taskController = TaskController(taskService)
    }

    @Nested
    @DisplayName("getPaginatedTasks Function")
    inner class GetPaginatedTasks {
        @Test
        fun `Test getPaginatedTasks should return status 200 if findAllByUserId service function is successful with default values`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch tasks was successful.") }
                jsonPath("$.data.totalCount") { value(1) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(1) }

                jsonPath("$.data.items[0].id") { value(taskResponseMock.id) }
                jsonPath("$.data.items[0].title") { value(taskResponseMock.title) }
                jsonPath("$.data.items[0].completed") { value(false) }
                jsonPath("$.data.items[0].userId") { value(userSample.id) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 200 if findAllByUserId service function is successful with passed values`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=1&pageSize=1&isMobile=false").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch tasks was successful.") }
                jsonPath("$.data.totalCount") { value(1) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(1) }

                jsonPath("$.data.items[0].id") { value(taskResponseMock.id) }
                jsonPath("$.data.items[0].title") { value(taskResponseMock.title) }
                jsonPath("$.data.items[0].completed") { value(false) }
                jsonPath("$.data.items[0].userId") { value(userSample.id) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 400 if page is less then 1`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=0&pageSize=1&isMobile=false").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Page must be at least 1") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 400 if page is more then 100`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=101&pageSize=1&isMobile=false").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Page must be less then 100") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 400 if pageSize is less then 0`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=1&pageSize=0&isMobile=false").andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("PageSize must be at least 1") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 404 if user is not found`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(null)

            mockMvc.get("$apiUrl/paginated/${userSample.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with id: (${userSample.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return status 200 if findAllByUserId service function is successful and is mobile`() {
            given(taskRepository.findAndCount(eq(userSample.id), any())).willReturn(createPageObject(listOf(taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=1&pageSize=1&isMobile=true").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch tasks was successful.") }
                jsonPath("$.data.totalCount") { value(1) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(1) }

                jsonPath("$.data.items[0].id") { value(taskResponseMock.id) }
                jsonPath("$.data.items[0].title") { value(taskResponseMock.title) }
                jsonPath("$.data.items[0].completed") { value(false) }
                jsonPath("$.data.items[0].userId") { value(userSample.id) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test getPaginatedTasks should return all items if is mobile`() {
            given(
                taskRepository.findAndCount(eq(userSample.id), any()),
            ).willReturn(createPageObject(listOf(taskResponseMock, taskResponseMock)))
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            mockMvc.get("$apiUrl/paginated/${userSample.id}?page=1&pageSize=1&isMobile=true").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch tasks was successful.") }
                jsonPath("$.data.totalCount") { value(2) }
                jsonPath("$.data.numberOfPages") { value(1) }
                jsonPath("$.data.items.length()") { value(2) }

                jsonPath("$.data.items[0].id") { value(taskResponseMock.id) }
                jsonPath("$.data.items[0].title") { value(taskResponseMock.title) }
                jsonPath("$.data.items[0].completed") { value(false) }
                jsonPath("$.data.items[0].userId") { value(userSample.id) }
                jsonPath("$.data.items[0].createdAt") { isNotEmpty() }
            }
        }
    }

    @Nested
    @DisplayName("getTaskStatistics Function")
    inner class GetTaskStatistics {
        @Test
        fun `Test getTaskStatistics should return status 404 if user do not exist`() {
            given(userRepository.findUserById(eq(userSample.id))).willReturn(null)

            mockMvc.get("$apiUrl/${userSample.id}/statistics").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with id: (${userSample.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test getTaskStatistics should return status 200 if user is set and there is no tasks`() {
            given(userRepository.findUserById(eq(userSample.id))).willReturn(userSample)
            given(taskRepository.findAllByUserId(eq(userSample.id))).willReturn(listOf())

            mockMvc.get("$apiUrl/${userSample.id}/statistics").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch task statistics was successful.") }
                jsonPath("$.data.total") { value(0) }
                jsonPath("$.data.done") { value(0) }
                jsonPath("$.data.open") { value(0) }
            }
        }

        @Test
        fun `Test getTaskStatistics should return status 200 if user is set and there is tasks`() {
            given(userRepository.findUserById(eq(userSample.id))).willReturn(userSample)
            given(taskRepository.findAllByUserId(eq(userSample.id))).willReturn(listOf(taskResponseMock))

            mockMvc.get("$apiUrl/${userSample.id}/statistics").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch task statistics was successful.") }
                jsonPath("$.data.total") { value(1) }
                jsonPath("$.data.done") { value(0) }
                jsonPath("$.data.open") { value(1) }
            }
        }

        @Test
        fun `Test getTaskStatistics should return status 200 and calculate statistics correctly`() {
            given(userRepository.findUserById(eq(userSample.id))).willReturn(userSample)
            given(
                taskRepository.findAllByUserId(eq(userSample.id)),
            ).willReturn(listOf(taskResponseMock, taskResponseMock.copy(completed = true)))

            mockMvc.get("$apiUrl/${userSample.id}/statistics").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch task statistics was successful.") }
                jsonPath("$.data.total") { value(2) }
                jsonPath("$.data.done") { value(1) }
                jsonPath("$.data.open") { value(1) }
            }
        }
    }

    @Nested
    @DisplayName("saveTask Function")
    inner class SaveTask {
        @Test
        fun `Test saveTask should return status 201 if create service function is successful`() {
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            val taskRequest =
                TaskRequest(
                    title = taskResponseMock.title,
                    userId = userSample.id,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(taskRequest)
            }.andExpect {
                status { isCreated() }
                jsonPath("$.status") { value(HttpStatus.CREATED.value()) }
                jsonPath("$.message") { value("Task was created successful.") }
                jsonPath("$.data.id") { value(taskResponseMock.id) }
                jsonPath("$.data.title") { value(taskResponseMock.title) }
                jsonPath("$.data.completed") { value(false) }
                jsonPath("$.data.userId") { value(userSample.id) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test saveTask should return status 400 if title is blank`() {
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            val taskRequest =
                TaskRequest(
                    title = "",
                    userId = userSample.id,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(taskRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("Title must not be blank!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test saveTask should return status 400 if userId is blank`() {
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)
            given(userRepository.findUserById(userSample.id)).willReturn(userSample)

            val taskRequest =
                TaskRequest(
                    title = taskResponseMock.title,
                    userId = "",
                )

            mockMvc.post(apiUrl) {
                withJsonContent(taskRequest)
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(HttpStatus.BAD_REQUEST.value()) }
                jsonPath("$.message") { value("User id must be set!") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test saveTask should return status 404 if user is not found`() {
            given(taskRepository.saveAndFlush(any())).willReturn(taskResponseMock)
            given(userRepository.findUserById(userSample.id)).willReturn(null)

            val taskRequest =
                TaskRequest(
                    title = taskResponseMock.title,
                    userId = userSample.id,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(taskRequest)
            }.andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("User with id: (${userSample.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("deleteTask Function")
    inner class DeleteTask {
        @Test
        fun `Test deleteTask should return status 200 if remove service function is successful`() {
            given(taskRepository.existsById(eq(taskResponseMock.id))).willReturn(true)

            mockMvc.delete("$apiUrl/${taskResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Task with id: (${taskResponseMock.id}) was deleted successfully.") }
                jsonPath("$.data") { value(null) }
            }
        }

        @Test
        fun `Test deleteTask should return status 404 if no item is found`() {
            given(taskRepository.existsById(eq(taskResponseMock.id))).willReturn(false)

            mockMvc.delete("$apiUrl/${taskResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Task with id: (${taskResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }

    @Nested
    @DisplayName("updateTask Function")
    inner class UpdateTask {
        @Test
        fun `Test updateTask should return status 200 if getById service function is successful`() {
            given(taskRepository.findTasksById(eq(taskResponseMock.id))).willReturn(taskResponseMock)
            val updateTask = taskResponseMock.copy(completed = true)
            given(taskRepository.saveAndFlush(any())).willReturn(updateTask)

            mockMvc.put("$apiUrl/${taskResponseMock.id}").andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Task with id (${taskResponseMock.id}) was updated successfully.") }
                jsonPath("$.data.id") { value(taskResponseMock.id) }
                jsonPath("$.data.title") { value(taskResponseMock.title) }
                jsonPath("$.data.completed") { value(true) }
                jsonPath("$.data.userId") { value(userSample.id) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
            }
        }

        @Test
        fun `Test updateTask should return status 404 if no item is found`() {
            given(taskRepository.findTasksById(eq(taskResponseMock.id))).willReturn(null)

            mockMvc.put("$apiUrl/${taskResponseMock.id}").andExpect {
                status { isNotFound() }
                jsonPath("$.status") { value(HttpStatus.NOT_FOUND.value()) }
                jsonPath("$.message") { value("Task with id: (${taskResponseMock.id}) was not found!") }
                jsonPath("$.data") { value(null) }
            }
        }
    }
}
