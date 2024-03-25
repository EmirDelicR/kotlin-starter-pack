package com.starter.api.rest.messages.core

import com.starter.api.exception.NotFoundException
import com.starter.api.exception.NotValidException
import com.starter.api.testUtils.sampleMessage
import com.starter.api.testUtils.sampleMessageRequest
import com.starter.api.utils.PageableResolver
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.assertThrows
import org.mockito.BDDMockito.times
import org.mockito.BDDMockito.verify
import org.mockito.kotlin.any
import org.mockito.kotlin.argForWhich
import org.mockito.kotlin.mock
import org.mockito.kotlin.doNothing

@DisplayName("MessageService test")
class MessageServiceTest {
    private val messageResponseMock = sampleMessage()
    private val pageableResolver = PageableResolver()
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
            given(messageRepository.findByIdOrMessageNull(messageResponseMock.id)).willReturn(messageResponseMock)
            assertThat(messageService.getById(messageResponseMock.id)).isEqualTo(messageResponseMock)

        }

        @Test
        fun `should throw NotFoundException if no entry in DB`() {
            given(messageRepository.findByIdOrMessageNull(messageResponseMock.id)).willReturn(null)
            val exc = assertThrows<NotFoundException> { messageService.getById(messageResponseMock.id) }

            assertThat(exc.message).isEqualTo("Message with id: (${messageResponseMock.id}) was not found!")
        }
    }

    @Nested
    @DisplayName("findAll Function")
    inner class FindAll {
        @Test
        fun `should throw exception if columnId is not valid`() {
            val exc = assertThrows<NotValidException> { messageService.findAll("", "DESC", "wrong-column", 0, 1) }
            assertThat(exc.message).isEqualTo("Cannot sort by wrong-column.Allowed sorting fields: createdAt, name")

            /*verify(
                pageableResolver,
                times(1),
            ).getSortObject(
               *//* argForWhich {
                    this.order == msgRequest.fullName && !this.unread && this.email == msgRequest.email && this.message == msgRequest.message
                },*//*
            )*/
        }

        @Test
        fun `should test is false`() {
            Assertions.assertFalse(false)
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
                    this.sender == msgRequest.fullName && !this.unread && this.email == msgRequest.email && this.message == msgRequest.message
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
            val exc = assertThrows<NotFoundException> { messageService.remove(messageResponseMock.id) }

            assertThat(exc.message).isEqualTo("Message with id: (${messageResponseMock.id}) was not found!")
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
            given(messageRepository.findByIdOrMessageNull(messageResponseMock.id)).willReturn(null)
            val exc = assertThrows<NotFoundException> { messageService.update(messageResponseMock.id) }

            assertThat(exc.message).isEqualTo("Message with id: (${messageResponseMock.id}) was not found!")
        }

        @Test
        fun `should return updated message if is found in DB`() {
            given(messageRepository.findByIdOrMessageNull(messageResponseMock.id)).willReturn(messageResponseMock)
            given(messageRepository.saveAndFlush(any())).willAnswer { invocation -> invocation.arguments[0] }

            messageService.update(messageResponseMock.id)

            verify(
                messageRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.sender == messageResponseMock.sender && this.unread && this.email == messageResponseMock.email && this.message == messageResponseMock.message
                },
            )
        }
    }
}