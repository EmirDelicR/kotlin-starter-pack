package com.starter.api.rest.messages.core

import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.testUtils.createPageObject
import com.starter.api.testUtils.sampleMessage
import com.starter.api.testUtils.sampleMessageRequest
import com.starter.api.utils.PageableResolver
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

class MessageServiceTest {
    private val messageResponseMock = sampleMessage()

    private lateinit var messageService: MessageService
    private val messageRepository = mock<MessageRepository>()

    @BeforeEach
    fun setUp() {
        messageService = MessageService(messageRepository)
    }

    @Nested
    @DisplayName("getById Function")
    inner class GetById {
        @Test
        fun `should return message if is found in DB`() {
            given(messageRepository.findMessageById(messageResponseMock.id)).willReturn(messageResponseMock)
            assertThat(messageService.getById(messageResponseMock.id)).isEqualTo(messageResponseMock)
        }

        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(messageRepository.findMessageById(messageResponseMock.id)).willReturn(null)

            assertThatCode {
                messageService.getById(messageResponseMock.id)
            }.hasMessage("Message with id: (${messageResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }
    }

    @Nested
    @DisplayName("findAll Function")
    inner class FindAll {
        @Test
        fun `should throw exception if columnId is not valid`() {
            assertThatCode {
                messageService.findAll("", "DESC", "wrong-column", 0, 1)
            }.hasMessage("Cannot sort by wrong-column.Allowed sorting fields: ${PageableResolver.allowedOrderingParams.joinToString()}")
                .isInstanceOf(NotValidException::class.java)
        }

        @Test
        fun `should call messageRepository findAndCount method if filter is empty`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock)))

            val response = messageService.findAll("", "DESC", "createdAt", 1, 10)

            verify(
                messageRepository,
                times(1),
            ).findAndCount(
                any(),
            )

            verify(
                messageRepository,
                times(0),
            ).findAndCountWithFilter(
                any(),
                any(),
            )

            assertThat(response.totalCount).isEqualTo(1)
            assertThat(response.numberOfPages).isEqualTo(1)
            assertThat(response.items.size).isEqualTo(1)
            assertThat(response.items[0]).isEqualTo(messageResponseMock)
        }

        @Test
        fun `should call messageRepository findAndCountWithFilter method if filter is not empty`() {
            val filter = "test"
            given(messageRepository.findAndCountWithFilter(eq(filter), any())).willReturn(createPageObject(listOf(messageResponseMock)))

            val response = messageService.findAll(filter, "DESC", "createdAt", 1, 10)

            verify(
                messageRepository,
                times(0),
            ).findAndCount(
                any(),
            )

            verify(
                messageRepository,
                times(1),
            ).findAndCountWithFilter(
                eq(filter),
                any(),
            )

            assertThat(response.totalCount).isEqualTo(1)
            assertThat(response.numberOfPages).isEqualTo(1)
            assertThat(response.items.size).isEqualTo(1)
            assertThat(response.items[0]).isEqualTo(messageResponseMock)
        }

        @Test
        fun `should call messageRepository findAndCount method if filter is empty and return multiple page`() {
            given(messageRepository.findAndCount(any())).willReturn(createPageObject(listOf(messageResponseMock, messageResponseMock), 1))

            val response = messageService.findAll("", "DESC", "createdAt", 1, 10)

            assertThat(response.totalCount).isEqualTo(2)
            assertThat(response.numberOfPages).isEqualTo(2)
            assertThat(response.items.size).isEqualTo(2)
            assertThat(response.items[0]).isEqualTo(messageResponseMock)
        }

        @Test
        fun `should call messageRepository findAndCountWithFilter method if filter is not empty and return multiple page`() {
            val filter = "test"
            given(
                messageRepository.findAndCountWithFilter(eq(filter), any()),
            ).willReturn(createPageObject(listOf(messageResponseMock, messageResponseMock), 1))

            val response = messageService.findAll(filter, "DESC", "createdAt", 1, 10)

            assertThat(response.totalCount).isEqualTo(2)
            assertThat(response.numberOfPages).isEqualTo(2)
            assertThat(response.items.size).isEqualTo(2)
            assertThat(response.items[0]).isEqualTo(messageResponseMock)
        }
    }

    @Nested
    @DisplayName("create Function")
    inner class Create {
        @Test
        fun `should create message and store it to DB`() {
            val msgRequest = sampleMessageRequest()
            given(messageRepository.saveAndFlush(any())).willReturn(messageResponseMock)

            messageService.create(msgRequest)

            verify(
                messageRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.sender == msgRequest.fullName && !this.unread && this.email == msgRequest.email &&
                        this.message == msgRequest.message
                },
            )
        }
    }

    @Nested
    @DisplayName("remove Function")
    inner class Remove {
        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(messageRepository.existsById(messageResponseMock.id)).willReturn(false)

            assertThatCode {
                messageService.remove(messageResponseMock.id)
            }.hasMessage("Message with id: (${messageResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return message if is found in DB`() {
            given(messageRepository.existsById(messageResponseMock.id)).willReturn(true)
            doNothing().`when`(messageRepository).deleteById(messageResponseMock.id)

            messageService.remove(messageResponseMock.id)

            verify(
                messageRepository,
                times(1),
            ).deleteById(
                argForWhich {
                    this == messageResponseMock.id
                },
            )
        }
    }

    @Nested
    @DisplayName("update Function")
    inner class Update {
        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(messageRepository.findMessageById(messageResponseMock.id)).willReturn(null)

            assertThatCode {
                messageService.update(messageResponseMock.id)
            }.hasMessage("Message with id: (${messageResponseMock.id}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }

        @Test
        fun `should return updated message if is found in DB`() {
            given(messageRepository.findMessageById(messageResponseMock.id)).willReturn(messageResponseMock)
            given(messageRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            messageService.update(messageResponseMock.id)

            verify(
                messageRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.sender == messageResponseMock.sender && this.unread && this.email == messageResponseMock.email &&
                        this.message == messageResponseMock.message
                },
            )
        }
    }
}
