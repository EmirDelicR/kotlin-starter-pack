# Use a Maven image as the base for the build stage to leverage caching of Maven dependencies
# Stage 1: Build the Spring Boot application
FROM maven:3.9.6-amazoncorretto-21 as builder
# Set the working directory inside the container to /app
WORKDIR /api

# Copy only the pom.xml initially to cache Maven dependencies
COPY pom.xml .
# Copy the project source code into the container
COPY src ./src

# Package the application without running tests to speed up the build process
RUN mvn package -DskipTests

# Start a new stage from a slim version of the OpenJDK 11 image to reduce the final image size
# Stage 2: Create the runtime image
FROM amazoncorretto:21-alpine

# Copy the built jar file from the build stage to the root directory of the runtime container
COPY --from=builder /api/target/*.jar api.jar

# Set the container to run the application when it starts
ENTRYPOINT ["java","-jar","/app.jar"]