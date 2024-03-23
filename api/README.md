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


https://github.com/springdoc/springdoc-openapi-demos/blob/2.x/demo-spring-boot-3-webmvc/pom.xml

https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/

https://springdoc.org/#demos