# Imagen base con Maven y JDK 21
FROM maven:3.9.14-eclipse-temurin-21
WORKDIR /app

# Copiamos pom.xml para instalar dependencias
COPY pom.xml .

# Instalamos dependencias sin compilar todo
RUN mvn dependency:go-offline -B

# Copiamos el código fuente
COPY src ./src

# Exponemos puerto
EXPOSE 8080

# Ejecutamos la app con DevTools activo
CMD ["mvn", "spring-boot:run"]