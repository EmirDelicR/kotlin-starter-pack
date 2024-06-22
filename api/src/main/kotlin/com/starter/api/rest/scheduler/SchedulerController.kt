package com.starter.api.rest.scheduler

import com.starter.api.dtos.ResponseEnvelope
import com.starter.api.utils.logger
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Validated
@RestController
@RequestMapping(path = ["/api/v1/cron"])
class SchedulerController(
    private val scheduleService: SchedulerService,
) {
    @PostMapping("/create")
    fun createCronTask(
        @RequestParam(name = "name", defaultValue = "Task name") name: String,
        @RequestParam(
            name = "duration",
            defaultValue = "1",
        )
        @Min(value = 1, message = "Duration must be at least 1 second") duration: Long,
    ): ResponseEnvelope<Int> {
        logger.info("Handling createCronTask Request")
        val task = Runnable { logger.info("Passed name: $name") }
        val createdTaskId = scheduleService.addCronTask(task, duration)

        return ResponseEnvelope(
            data = createdTaskId,
            message = "Cron task created successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @DeleteMapping("/delete/{taskId}")
    fun deleteCronTask(
        @PathVariable taskId: Int,
    ): ResponseEnvelope<Int> {
        logger.info("Handling deleteCronTask Request")
        scheduleService.removeCronTaskFromScheduler(taskId)

        return ResponseEnvelope(
            data = taskId,
            message = "Deleted cron task successful.",
            status = HttpStatus.OK.value(),
        )
    }

    @GetMapping("/tasks")
    fun getCronTasks(): ResponseEnvelope<String> {
        logger.info("Handling getCronTasks Request")
        val tasks = scheduleService.getCronTasks()

        return ResponseEnvelope(
            data = tasks,
            message = "Fetch cron tasks successful.",
            status = HttpStatus.OK.value(),
        )
    }

    // list all cron jobs in terminal: crontab -l
    // curl -X GET http://localhost:3100/api/v1/cron/tasks
    // curl -X POST http://localhost:3100/api/v1/cron/create?name=MyCustomTask&duration=3
    // curl -X DELETE http://localhost:3100/api/v1/cron/delete/1
}
