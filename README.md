# Contact Management System

A full-stack web application for managing personal contacts, built with Spring Boot and React.js.

## Tech Stack

**Backend:**
- Java 25 + Spring Boot 3.5.14
- Spring Data JPA + Hibernate
- SQL Server Express
- Spring Security + JWT Authentication
- BCrypt Password Hashing
- SLF4J + Logback Logging
- JUnit 5 + Mockito (Unit Tests)
- SonarQube (Code Quality)

**Frontend:**
- React.js + Vite
- React Router DOM
- Axios
- React Toastify

## Features

- User registration (email or phone number)
- JWT-based login and authentication
- Change password
- Create, view, edit, delete contacts
- Paginated contact list
- Search contacts by name
- User profile page
- Global exception handling
- 11 unit tests passing
- SonarQube Quality Gate passed

## Project Structure

```
contact-management/
├── src/main/java/com/contactmgmt/contact_management/
│   ├── controller/      REST Controllers
│   ├── service/         Business Logic
│   ├── repository/      Data Access
│   ├── entity/          JPA Entities
│   ├── dto/             Data Transfer Objects
│   ├── security/        JWT + Security Config
│   └── exception/       Global Exception Handler
└── src/test/            Unit Tests
```

## Setup Instructions

### Prerequisites
- Java 25
- Maven 3.9+
- SQL Server Express
- Node.js 24+

### Backend Setup

1. Create database:
```sql
CREATE DATABASE contact_db;
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=contact_db;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword
```

3. Run the backend:
```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| PUT | /api/auth/change-password | Change password |
| GET | /api/contacts | Get all contacts (paginated) |
| POST | /api/contacts | Create contact |
| GET | /api/contacts/{id} | Get contact by ID |
| PUT | /api/contacts/{id} | Update contact |
| DELETE | /api/contacts/{id} | Delete contact |
| GET | /api/user/profile | Get user profile |

## Testing

```bash
mvn test
```

11 tests passing across AuthService and ContactService.

## GitHub

- Backend: `main` branch
- Frontend: `frontend` branch