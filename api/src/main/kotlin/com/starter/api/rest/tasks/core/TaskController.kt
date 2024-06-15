package com.starter.api.rest.tasks.core

import com.starter.api.dtos.PageableResponse
import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.rest.tasks.dtos.TaskRequest
import com.starter.api.rest.tasks.dtos.TaskResponse
import com.starter.api.utils.logger
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/tasks"])
class TaskController(val taskService: TaskService) {
    @GetMapping("/paginated/{userId}")
    @ResponseStatus(HttpStatus.OK)
    fun getPaginatedTasks(
        @PathVariable userId: String,
        @RequestParam(
            name = "page",
            defaultValue = "1",
        )
        @Min(value = 1, message = "Page must be at least 1")
        @Max(value = 100, message = "Page must be less then 100") page: Int,
        @RequestParam(
            name = "pageSize",
            defaultValue = "10",
        ) @Min(value = 1, message = "PageSize must be at least 1") pageSize: Int,
        @RequestParam(name = "isMobile", defaultValue = "false") isMobile: Boolean,
    ): ResponseEnvelope<PageableResponse<TaskResponse>> {
        logger.info("Handling getPaginatedTasks Request with user id: $userId")
        val userTasks = taskService.findAllByUserId(userId, page, pageSize, isMobile)

        return ResponseEnvelope(
            data = userTasks,
            message = "Fetch tasks was successful.",
            status = HttpStatus.OK.value(),
        )
    }

    // TODO get statistics for task

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun saveTask(
        @RequestBody @Valid taskRequest: TaskRequest,
    ): ResponseEnvelope<TaskResponse> {
        logger.info("Handling saveTask Request")
        val task = taskService.create(taskRequest)

        return ResponseEnvelope(
            data = task.toResponse(),
            message = "Task was created successful.",
            status = HttpStatus.CREATED.value(),
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteTask(
        @PathVariable id: String,
    ): ResponseEnvelope<Nothing?> {
        logger.info("Handling deleteTask Request")
        taskService.remove(id)

        return ResponseEnvelope(
            data = null,
            message = "Task with id: ($id) was deleted successfully.",
            status = HttpStatus.OK.value(),
        )
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateTask(
        @PathVariable id: String,
    ): ResponseEnvelope<TaskResponse> {
        logger.info("Handling updateTask Request")
        val task = taskService.update(id)

        return ResponseEnvelope(
            data = task.toResponse(),
            message = "Task with id ($id) was updated successfully.",
            status = HttpStatus.OK.value(),
        )
    }
}
