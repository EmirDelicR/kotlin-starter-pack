package com.starter.api

import jakarta.transaction.Transactional
import org.junit.runner.notification.RunListener
import org.junit.jupiter.api.Nested
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.core.annotation.AnnotatedElementUtils.hasAnnotation
import org.springframework.core.env.MapPropertySource
import org.springframework.test.context.ContextConfigurationAttributes
import org.springframework.test.context.ContextCustomizer
import org.springframework.test.context.ContextCustomizerFactory
import org.springframework.test.context.MergedContextConfiguration
import java.lang.annotation.Inherited
import org.testcontainers.utility.DockerImageName
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.utility.TestcontainersConfiguration

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Inherited
@Transactional
annotation class EnableMySqlTestContainer

/**
 * 1. ADD @EnableMySqlTestContainer to test that uses repositories
 * 2. uncomment code in spring.factories in resource file
 * 3. uncomment code in application properties in test folder
 * */

class EnableMySqlTestContainerContextCustomizerFactory : ContextCustomizerFactory, RunListener() {
    override fun createContextCustomizer(
        testClass: Class<*>,
        configAttributes: MutableList<ContextConfigurationAttributes>,
    ): ContextCustomizer? {
        if (hasAnnotation(testClass, Nested::class.java) &&
            hasAnnotation(testClass.declaringClass, EnableMySqlTestContainer::class.java)
        ) {
            return MySqlTestContainerContextCustomizer
        }
        if (!hasAnnotation(testClass, EnableMySqlTestContainer::class.java)) {
            return null
        }
        return MySqlTestContainerContextCustomizer
    }

    companion object MySqlTestContainerContextCustomizer : ContextCustomizer {
        private val image: DockerImageName =
            DockerImageName
                .parse("mysql")
                .withTag("8.0")
        private var container: MySQLContainer<Nothing> =
            MySQLContainer<Nothing>(image).apply {
                withDatabaseName("test_db")
                withUsername("test")
                withPassword("test")
                withReuse(true)
                start()
            }
        private var shutdownHook =
            Thread {
                container.stop()
            }

        override fun customizeContext(
            context: ConfigurableApplicationContext,
            mergedConfig: MergedContextConfiguration,
        ) {
            TestcontainersConfiguration.getInstance().updateUserConfig("testcontainers.reuse.enable", "true")
            try {
                Runtime.getRuntime().addShutdownHook(shutdownHook)
            } catch (ignore: IllegalArgumentException) {
                // Shutdown hook is already registered. Don't register the shutdown hook a second time
            }
            val properties =
                mapOf(
                    "spring.datasource.url" to container.jdbcUrl,
                    "spring.datasource.username" to container.username,
                    "spring.datasource.password" to container.password,
                    "spring.test.database.replace" to AutoConfigureTestDatabase.Replace.NONE,
                )
            val propertySource = MapPropertySource("MySql Test Container Properties", properties)
            context.environment.propertySources.addFirst(propertySource)
        }

        override fun equals(other: Any?): Boolean {
            if (this === other) return true
            if (other !is MySqlTestContainerContextCustomizer) return false
            return image.asCanonicalNameString() == other.image.asCanonicalNameString()
        }

        override fun hashCode(): Int {
            return image.asCanonicalNameString().hashCode()
        }
    }
}