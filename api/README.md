## Setup

[Initial project web page](https://start.spring.io/)

#### What to choose

1. Project -> Maven
2. Language -> Kotlin
3. Spring Boot -> 3.2.3
4. Java -> 21
5. Dependencies -> Spring Data JPA, Spring Web, MySQL Driver

Maven docker image: https://hub.docker.com/r/fxdom/maven-openjdk-21/tags

TODO @ed add more docs

## How to run

gor to /api folder and run:

```console
docker compose up
```

run app by clicking play

### DB instruction

If something is running on port `3306` default one for mysql you can check with command:

```console
sudo netstat -nlp | grep 3306
```

You can kill that service with command:

```console
service mysql stop
```

## Adding lint and format

[ktlint](https://reflectoring.io/code-format-with-ktlint/)

[repo](https://github.com/gantsign/ktlint-maven-plugin)

ktlint:format format your Kotlin sources using ktlint.

ktlint: check your Kotlin sources for code style violations using ktlint.

ktlint: ktlint generate project report of code style violations using ktlint.

```console
mvn ktlint:format

mvn ktlint:check

mvn ktlint:ktlint

```

## Adding swagger

[swagger](https://springdoc.org/#spring-hateoas-support)

[Swagger-app-url](http://localhost:3100/swagger-ui/index.html)

Add to pom.xml file

```xml
<!--Swagger-->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.4.0</version>
</dependency>
<!--End Swagger-->
```

for auth in swagger SpringdocConfig File

```kotlin
package com.starter.api.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.context.annotation.Configuration

@Configuration
@OpenAPIDefinition(info = Info(title = "Swagger application API", version = "v1"))
@SecurityScheme(
    type = SecuritySchemeType.HTTP,
    name = "basicAuth",
    scheme = "basic")
class SpringdocConfig
```

https://www.baeldung.com/springdoc-openapi-form-login-and-basic-authentication

https://github.com/eugenp/tutorials/blob/master/spring-security-modules/spring-security-web-springdoc/src/main/java/com/baeldung/basicauth/FooController.java

https://github.com/springdoc/springdoc-openapi-demos/blob/2.x/demo-spring-boot-3-webmvc/pom.xml

https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/

https://springdoc.org/#demos

## Test setup

1. Add in test folder resource/application.properties
    - This will not connect to test during app boot

```properties
spring.jpa.properties.hibernate.globally_quoted_identifiers=true
```

2. Check test examples

Links:

[Spring test - lot of examples](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.testing.spring-boot-applications.spring-mvc-tests)

[BDD-mockito](https://www.baeldung.com/bdd-mockito)



## JWT implementation
[JWT](https://www.baeldung.com/spring-security-sign-jwt-token)

[Repo](https://github.com/eugenp/tutorials/blob/master/spring-security-modules/spring-security-core-2/src/main/java/com/baeldung/jwtsignkey/jwtconfig/JwtUtils.java)

## Argon 2 password hash

https://github.com/eugenp/tutorials/blob/ff723063a709cd6983cc35bc1302112c43f2c2f0/core-java-modules/core-java-security-3/src/test/java/com/baeldung/hash/argon/HashPasswordUnitTest.java#L13

https://www.baeldung.com/java-argon2-hashing

https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web/3.2.4

## DB samples

https://www.geeksforgeeks.org/spring-boot-load-initial-data/