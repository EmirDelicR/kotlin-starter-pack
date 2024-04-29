package com.starter.api.testUtils

import com.starter.api.rest.auth.dtos.LoginUserRequest
import com.starter.api.rest.auth.dtos.RegisterUserRequest
import com.starter.api.rest.messages.core.Message
import com.starter.api.rest.messages.dtos.MessageRequest
import com.starter.api.rest.roles.core.Role
import com.starter.api.rest.roles.enums.RoleType
import com.starter.api.rest.subscriptions.core.Subscription
import com.starter.api.rest.subscriptions.enums.SubscriptionType
import com.starter.api.rest.tasks.core.Task
import com.starter.api.rest.users.core.User
import com.starter.api.rest.users.dtos.UserUpdateRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

fun sampleMessage(): Message {
    return Message(
        message = "Some message text",
        email = "john@doe.com",
        sender = "John Doe",
        unread = false,
        id = "message-uuid",
    )
}

fun sampleSubscription(): Subscription {
    return Subscription(
        id = "subscription-uuid",
        name = SubscriptionType.NEWS,
    )
}

fun sampleRole(): Role {
    return Role(
        id = "role-uuid",
        type = RoleType.USER,
    )
}

fun sampleUser(): User {
    val role = sampleRole()
    val subscriptions = sampleSubscription()
    return User(
        id = "user-uuid",
        email = "john@doe.com",
        password = "some-password",
        userName = "Cabal",
        firstName = "John",
        lastName = "Doe",
        profileUpdated = false,
        age = 25,
        token = "some-token",
        avatar = "avatar",
        loggedIn = false,
        subscribed = true,
        role = role,
        subscriptions = setOf(subscriptions),
    )
}

fun sampleTask(): Task {
    val user = sampleUser()
    return Task(
        title = "Some task title",
        id = "task-uuid",
        user = user,
    )
}

fun sampleMessageRequest(): MessageRequest {
    return MessageRequest(
        message = "Some message text",
        email = "john@doe.com",
        fullName = "John Doe",
    )
}

fun sampleUpdateUserRequest(): UserUpdateRequest {
    return UserUpdateRequest(
        age = 12,
        avatar = "avatar",
        userName = "Cabal",
        lastName = "Doe",
        firstName = "John",
        subscribed = true,
        subscriptions = emptySet(),
    )
}

fun sampleRegisterUserRequest(): RegisterUserRequest {
    return RegisterUserRequest(
        userName = "Cabal",
        firstName = "John",
        lastName = "Doe",
        password = "Test123!",
        email = "test@test.com",
    )
}

fun sampleLoginUserRequest(): LoginUserRequest {
    return LoginUserRequest(
        password = "Test123!",
        email = "test@test.com",
    )
}

fun <T> createPageObject(
    list: List<T>,
    pageSize: Int = 10,
): Page<T> {
    val pageable: Pageable = PageRequest.of(0, pageSize)
    return PageImpl(list, pageable, list.size.toLong())
}
