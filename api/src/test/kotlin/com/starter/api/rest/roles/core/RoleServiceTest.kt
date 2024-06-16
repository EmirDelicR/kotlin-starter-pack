package com.starter.api.rest.roles.core

import com.starter.api.exception.NotFoundException
import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.testUtils.sampleRole
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
import org.mockito.kotlin.mock

class RoleServiceTest {
    private val roleResponseMock = sampleRole()

    private lateinit var roleService: RoleService
    private val roleRepository = mock<RoleRepository>()

    @BeforeEach
    fun setUp() {
        roleService = RoleService(roleRepository)
    }

    @Nested
    @DisplayName("findAll Function")
    inner class FindAll {
        @Test
        fun `should return list of roles`() {
            val listOfRoles = listOf(roleResponseMock)
            given(roleRepository.findAll()).willReturn(listOfRoles)
            assertThat(roleRepository.findAll()).isEqualTo(listOfRoles)
        }
    }

    @Nested
    @DisplayName("getByType Function")
    inner class GetByType {
        @Test
        fun `should return role by type`() {
            given(roleRepository.getRoleByType(roleResponseMock.type)).willReturn(roleResponseMock)
            assertThat(roleService.getByType(roleResponseMock.type)).isEqualTo(roleResponseMock)
        }

        @Test
        fun `should throw 404 bot found error if role is not existing`() {
            given(roleRepository.getRoleByType(roleResponseMock.type)).willReturn(null)

            assertThatCode {
                roleService.getByType(roleResponseMock.type)
            }.hasMessage("Role with type: (${roleResponseMock.type}) was not found!")
                .isInstanceOf(NotFoundException::class.java)
        }
    }

    @Nested
    @DisplayName("create Function")
    inner class Create {
        @Test
        fun `should create role and store it to DB`() {
            val roleRequest = RoleRequest(RoleType.USER)
            given(roleRepository.saveAndFlush(any())).willReturn(roleResponseMock)

            roleService.create(roleRequest)

            verify(
                roleRepository,
                times(1),
            ).saveAndFlush(
                argForWhich {
                    this.type == roleRequest.type
                },
            )
        }
    }
}
