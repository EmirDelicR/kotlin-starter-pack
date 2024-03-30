package com.starter.api.rest.users.core

import com.starter.api.exception.NotFoundException
import com.starter.api.rest.users.dtos.UserUpdateRequest
import org.springframework.stereotype.Service

@Service
class UserService(val userRepository: UserRepository) {
    fun getById(id: String): User =
        userRepository.findUserById(id)
            ?: throw NotFoundException("User with id: ($id) was not found!")

    fun update(
        id: String,
        userRequest: UserUpdateRequest,
    ): User {
        val user = getById(id)

        return user.let {
            it.age = userRequest.age
            it.firstName = userRequest.firstName
            it.lastName = userRequest.lastName
            it.subscribed = userRequest.subscribed
            it.avatar = userRequest.avatar
            it.profileUpdated = true
            it.userName = getUserName(userRequest.userName, user.userName, userRequest.firstName, userRequest.lastName)
            // TODO @ed add subscriptions here
            userRepository.saveAndFlush(it)
        }
    }

    private fun getUserName(
        newUserName: String,
        oldUserName: String,
        firstName: String,
        lastName: String,
    ): String {
        if (newUserName.isNotEmpty()) {
            return newUserName
        }

        if (oldUserName.isNotEmpty()) {
            return oldUserName
        }

        return "$firstName $lastName".trim()
    }
}
