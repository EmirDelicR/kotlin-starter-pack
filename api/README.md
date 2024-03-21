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

## Adding lint and format

[ktlint](https://reflectoring.io/code-format-with-ktlint/)

[repo](https://github.com/gantsign/ktlint-maven-plugin)

ktlint:format format your Kotlin sources using ktlint.

ktlint:check check your Kotlin sources for code style violations using ktlint.

ktlint:ktlint generate project report of code style violations using ktlint.

```console
mvn ktlint:format

mvn ktlint:check

mvn ktlint:ktlint

```

## Adding swagger

[swagger](https://www.geeksforgeeks.org/spring-boot-rest-api-documentation-using-swagger/)

https://github.com/vojtechruz/springfox-example/blob/master/src/main/java/com/vojtechruzicka/springfoxexample/config/SpringFoxConfig.java