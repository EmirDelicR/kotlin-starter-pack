## Setup

[Initial project web page](https://start.spring.io/)

#### What to choose

1. Project -> Maven
2. Language -> Kotlin
3. Spring Boot -> 3.2.3
4. Java -> 21
5. Dependencies -> Spring Data JPA, Spring Web, MySQL Driver

## How to run

gor to /api folder and run:

```console
docker compose up
```

run app by clicking play

Go to Swagger URL:

[App-Swagger](http://localhost:3100/swagger-ui/index.html)

#### How to use swagger

1. Register user and from response grab the token
2. Set token to authorization 
3. Make request for other calls

### DB instruction

If something is running on port `3306` default one for mysql you can check with command:

```console
sudo netstat -nlp | grep 3306
```

You can kill that service with command:

```console
service mysql stop
```

## Use POSTMAN

Import post collection. After importing run first **register** request. After this you will need to update some data:

1. Copy user id and go to **kotlin-backed-api** collection and update in variables user_id
2. In same register request from above from response headers you will see **Set-Cookie jwt=...**, copy token and set in variables as token
3. Update other variables after specific request 


## Adding lint and format

[ktlint](https://reflectoring.io/code-format-with-ktlint/)

[repo](https://github.com/gantsign/ktlint-maven-plugin)

format your Kotlin sources using ktlint
```console 
mvn ktlint:format
```

check your Kotlin sources for code style violations using ktlint
```console
mvn ktlint:check
```

generate project report of code style violations using ktlint
```console 
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

[OpenAPI Auth](https://www.baeldung.com/springdoc-openapi-form-login-and-basic-authentication)

[Example repository](https://github.com/eugenp/tutorials/blob/master/spring-security-modules/spring-security-web-springdoc/src/main/java/com/baeldung/basicauth/FooController.java)

[Pom example](https://github.com/springdoc/springdoc-openapi-demos/blob/2.x/demo-spring-boot-3-webmvc/pom.xml)

[Configuration](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)

[Demos](https://springdoc.org/#demos)

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

[Unit test](https://github.com/eugenp/tutorials/blob/ff723063a709cd6983cc35bc1302112c43f2c2f0/core-java-modules/core-java-security-3/src/test/java/com/baeldung/hash/argon/HashPasswordUnitTest.java#L13)

[Example](https://www.baeldung.com/java-argon2-hashing)

[Artifact](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web/3.2.4)

## DB samples

[DB load init data](https://www.geeksforgeeks.org/spring-boot-load-initial-data/)

## Maven docker image

[Maven docker image](https://hub.docker.com/r/fxdom/maven-openjdk-21/tags)

## Some useful links

https://github.com/eugenp/tutorials/blob/master/spring-security-modules/spring-security-core-2/src/main/java/com/baeldung/jwtsignkey/jwtconfig/JwtUtils.java
https://www.youtube.com/watch?v=iqkt9ip567A&list=PLvN8k8yxjoeud4ESoB-wjiieqYGaDVqPR&index=7