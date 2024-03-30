package com.starter.api.rest.subscriptions.core

import com.starter.api.rest.subscriptions.dtos.SubscriptionRequest
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.testUtils.sampleSubscription
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.times
import org.mockito.BDDMockito.verify
import org.mockito.kotlin.any
import org.mockito.kotlin.argForWhich
import org.mockito.kotlin.mock

@DisplayName("SubscriptionService test")
class SubscriptionServiceTest {
    private val subscriptionResponseMock = sampleSubscription()
    private lateinit var subscriptionService: SubscriptionService
    private val subscriptionRepository = mock<SubscriptionRepository>()

    @BeforeEach
    fun setUp() {
        subscriptionService = SubscriptionService(subscriptionRepository)
    }

    @Test
    fun `should return list of subscriptions`() {
        val listOfSubs = listOf(subscriptionResponseMock)
        given(subscriptionRepository.findAll()).willReturn(listOfSubs)
        assertThat(subscriptionService.findAll()).isEqualTo(listOfSubs)
    }

    @Test
    fun `should create subscription and store it to DB`() {
        val subRequest = SubscriptionRequest(SubscriptionType.NEWS)
        given(subscriptionRepository.saveAndFlush(any())).willReturn(subscriptionResponseMock)

        subscriptionService.create(subRequest)

        verify(
            subscriptionRepository,
            times(1),
        ).saveAndFlush(
            argForWhich {
                this.name == subRequest.name
            },
        )
    }
}
