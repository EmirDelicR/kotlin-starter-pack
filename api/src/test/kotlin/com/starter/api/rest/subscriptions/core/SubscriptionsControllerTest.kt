package com.starter.api.rest.subscriptions.core

import com.starter.api.config.DataLoader
import com.starter.api.rest.subscriptions.dtos.SubscriptionRequest
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.testUtils.sampleSubscription
import com.starter.api.testUtils.withJsonContent
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.kotlin.any
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.http.HttpStatus
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(roles = ["ADMIN"])
class SubscriptionsControllerTest() {
    private val apiUrl = "/api/v1/subscriptions"
    private val subscriptionResponseMock = sampleSubscription()

    @MockBean
    private lateinit var subscriptionRepository: SubscriptionRepository

    @SpyBean
    private lateinit var subscriptionService: SubscriptionService

    @MockBean
    private lateinit var dataLoader: DataLoader

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var subscriptionController: SubscriptionController

    @BeforeEach
    fun setUp() {
        subscriptionService = SubscriptionService(subscriptionRepository)
        subscriptionController = SubscriptionController(subscriptionService)
    }

    @Nested
    @DisplayName("getSubscriptions Function")
    inner class GetSubscriptions {
        @Test
        fun `Test getSubscriptions should return status 200 if findAll service function is successful`() {
            given(subscriptionRepository.findAll()).willReturn(arrayListOf(subscriptionResponseMock))

            mockMvc.get(apiUrl).andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch subscriptions successful.") }
                jsonPath("$.data.length()") { value(1) }
                jsonPath("$.data[0].id") { value(subscriptionResponseMock.id) }
                jsonPath("$.data[0].name") { value(subscriptionResponseMock.name.toString()) }
            }
        }
    }

    @Nested
    @DisplayName("saveSubscription Function")
    inner class SaveSubscription {
        @Test
        fun `Test saveSubscription should return status 201 if create service function is successful`() {
            given(subscriptionRepository.saveAndFlush(any())).willReturn(subscriptionResponseMock)

            val subscriptionRequest =
                SubscriptionRequest(
                    name = SubscriptionType.NEWS,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(subscriptionRequest)
            }.andExpect {
                status { isCreated() }
                jsonPath("$.status") { value(HttpStatus.CREATED.value()) }
                jsonPath("$.message") { value("Subscription was created successful.") }
                jsonPath("$.data.id") { value(subscriptionResponseMock.id) }
                jsonPath("$.data.name") { value(subscriptionResponseMock.name.toString()) }
                jsonPath("$.data.createdAt") { isNotEmpty() }
            }
        }
    }
}
