package com.starter.api

import com.starter.api.config.DataLoader
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean

@SpringBootTest
class ApiApplicationTests {
    @MockBean
    private lateinit var dataLoader: DataLoader

    @Test
    fun contextLoads() {
    }
}
