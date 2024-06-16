package com.starter.api.rest.tasks.core

import com.starter.api.dtos.PageableResponse
import com.starter.api.exception.NotFoundException
import com.starter.api.rest.tasks.dtos.TaskRequest
import com.starter.api.rest.tasks.dtos.TaskResponse
import com.starter.api.rest.tasks.dtos.TaskStatisticsResponse
import com.starter.api.rest.users.core.UserService
import com.starter.api.utils.PageableResolver
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val userService: UserService,
) {
    private val pageableResolver = PageableResolver()

    fun getById(id: String): Task =
        taskRepository.findTasksById(id)
            ?: throw NotFoundException("Task with id: ($id) was not found!")

    fun findAllByUserId(
        userId: String,
        offset: Int,
        limit: Int,
        isMobile: Boolean,
    ): PageableResponse<TaskResponse> {
        val user = userService.getById(userId)
        val sort = pageableResolver.getSortObject()
        var skip = offset
        var take = limit

        if (isMobile) {
            skip = 1
            take = limit * (offset)
        }

        val pageableReq = pageableResolver.getPageableObject(skip, take, sort)
        val response: Page<Task> = taskRepository.findAndCount(user.id, pageableReq)

        return PageableResponse(
            totalCount = response.totalElements,
            numberOfPages = response.totalPages,
            items =
                response.content.map {
                    it.toResponse()
                },
        )
    }

    fun getTaskStatistics(userId: String): TaskStatisticsResponse {
        val user = userService.getById(userId)
        val tasks = taskRepository.findAllByUserId(user.id)
        val doneTasks = tasks.filter { it.completed }

        return TaskStatisticsResponse(
            total = tasks.size,
            done = doneTasks.size,
            open = tasks.size - doneTasks.size,
        )
    }

    fun create(taskRequest: TaskRequest): Task {
        val user = userService.getById(taskRequest.userId)

        val task =
            Task(
                completed = false,
                user = user,
                title = taskRequest.title,
            )

        return taskRepository.saveAndFlush(task)
    }

    fun remove(id: String) {
        if (!taskRepository.existsById(id)) {
            throw NotFoundException("Task with id: ($id) was not found!")
        }

        taskRepository.deleteById(id)
    }

    fun update(id: String): Task {
        val task = getById(id)

        return task.let {
            it.completed = !it.completed
            taskRepository.saveAndFlush(it)
        }
    }
}
