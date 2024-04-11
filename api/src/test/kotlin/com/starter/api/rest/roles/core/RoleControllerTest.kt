package com.starter.api.rest.roles.core

import com.starter.api.rest.roles.dtos.RoleRequest
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.testUtils.sampleRole
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
@WithMockUser
class RoleControllerTest {
    private val apiUrl = "/api/v1/roles"
    private val roleResponseMock = sampleRole()

    @MockBean
    private lateinit var roleRepository: RoleRepository

    @SpyBean
    private lateinit var roleService: RoleService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var roleController: RoleController

    @BeforeEach
    fun setUp() {
        roleService = RoleService(roleRepository)
        roleController = RoleController(roleService)
    }

    @Nested
    @DisplayName("getRoles Function")
    inner class GetRoles {
        @Test
        fun `Test getRoles should return status 200 if findAll service function is successful`() {
            given(roleRepository.findAll()).willReturn(arrayListOf(roleResponseMock))

            mockMvc.get(apiUrl).andExpect {
                status { isOk() }
                jsonPath("$.status") { value(HttpStatus.OK.value()) }
                jsonPath("$.message") { value("Fetch roles successful.") }
                jsonPath("$.data.length()") { value(1) }
                jsonPath("$.data[0].id") { value(roleResponseMock.id) }
                jsonPath("$.data[0].type") { value(roleResponseMock.type.toString()) }
            }
        }
    }

    @Nested
    @DisplayName("saveRole Function")
    inner class SaveRole {
        @Test
        fun `Test saveRole should return status 201 if create service function is successful`() {
            given(roleRepository.saveAndFlush(any())).willReturn(roleResponseMock)

            val roleRequest =
                RoleRequest(
                    type = RoleType.USER,
                )

            mockMvc.post(apiUrl) {
                withJsonContent(roleRequest)
            }.andExpect {
                status { isCreated() }
                jsonPath("$.status") { value(HttpStatus.CREATED.value()) }
                jsonPath("$.message") { value("Role was created successful.") }
                jsonPath("$.data.id") { value(roleResponseMock.id) }
                jsonPath("$.data.type") { value(roleResponseMock.type.toString()) }
            }
        }
    }
}
