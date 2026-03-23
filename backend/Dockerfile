# ---- Build stage ----
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy gradle wrapper and build files first for layer caching
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .

# Download dependencies (cached unless build.gradle changes)
RUN ./gradlew dependencies --no-daemon || true

# Copy source and build
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S flip67 && adduser -S flip67 -G flip67

# Copy the built jar from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

RUN chown flip67:flip67 app.jar

USER flip67

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

