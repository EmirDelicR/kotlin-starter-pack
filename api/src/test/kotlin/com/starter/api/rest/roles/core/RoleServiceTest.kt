package com.starter.api.rest.roles.core

import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.testUtils.sampleRole
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

@DisplayName("RoleService test")
class RoleServiceTest {
    private val roleResponseMock = sampleRole()
    private lateinit var roleService: RoleService
    private val roleRepository = mock<RoleRepository>()

    @BeforeEach
    fun setUp() {
        roleService = RoleService(roleRepository)
    }

    @Test
    fun `should return list of roles`() {
        val listOfRoles = listOf(roleResponseMock)
        given(roleRepository.findAll()).willReturn(listOfRoles)
        assertThat(roleRepository.findAll()).isEqualTo(listOfRoles)
    }

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
