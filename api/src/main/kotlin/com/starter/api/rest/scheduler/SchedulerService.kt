package com.starter.api.rest.scheduler

import com.starter.api.exception.NotFoundException
import org.springframework.scheduling.TaskScheduler
import org.springframework.stereotype.Component
import java.time.Duration
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.atomic.AtomicInteger

@Component
class SchedulerService(private val taskScheduler: TaskScheduler) {
    private val taskId = AtomicInteger()
    private val futureTasks = mutableMapOf<Int, ScheduledFuture<*>>()

    fun addCronTask(
        task: Runnable,
        duration: Long,
    ): Int {
        val taskPeriod = Duration.ofSeconds(duration)
        val scheduledTaskFuture = taskScheduler.scheduleAtFixedRate(task, taskPeriod)

        val id = taskId.incrementAndGet()
        futureTasks[id] = scheduledTaskFuture

        return id
    }

    fun removeCronTaskFromScheduler(id: Int) {
        futureTasks[id]?.let {
            it.cancel(true)
            futureTasks.remove(id)
        } ?: throw NotFoundException("Cron task with id: ($id) was not found!")
    }

    fun getCronTasks(): String {
        if (futureTasks.isEmpty()) {
            throw NotFoundException("There is no cron task scheduled!")
        }

        return futureTasks.toString()
    }

    /* This can be use to directly create cron task after running app
    @Scheduled(fixedDelay = 3_000, initialDelay = 5_000)
    fun fixedRateScheduledTask() {
        logger.info("Starting scheduled task")
    }

    // https://crontab.cronhub.io/ - cron expression generator
    @Scheduled(cron= "0 0 6,15 * * MON-FRI")
    fun specificTimeScheduledTask() {
        logger.info("Starting specific time task")
    }
     */
}
