# 🎬 Cineverse API

A RESTful API for a movie platform built with **NestJS**, **PostgreSQL**, and **TypeORM**. This application manages movies, actors, genres, and reviews with Role-Based Access Control (RBAC).

## 🚀 Technologies
* **Framework:** NestJS
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Cache:** Redis
* **Containerization:** Docker & Docker Compose
* **Documentation:** Swagger UI

---

## 🛠️ Prerequisites
Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [Node.js](https://nodejs.org/) (LTS version)

---

## 📥 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cineverse-api
npm install
```
### 2. Configure Environment Variables
Create a .env file in the root directory and configure it as follows:
```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5440 
DATABASE_USER=postgres
DATABASE_PASSWORD=pass
DATABASE_NAME=cineverse

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6380

# JWT Security
JWT_SECRET=super_secret_key_change_this

# Admin Seed Credentials
ADMIN_EMAIL=admin@cineverse.com
ADMIN_PASSWORD=secureAdminPassword123!
```
### 3. Start Database Containers
Launch PostgreSQL and Redis using Docker Compose:
```bash
docker compose up -d
```
### 4. Seed the Database
Step A: Create Schema & Basic Data Run the SQL script to create tables and insert movies, actors, and genres:
```bash
cat src/resources/seed.sql | docker exec -i cineverse_db psql -U DATABASE_USER -d DATABASE_NAME
```
Step B: Create Admin Account Run the custom seeder to create the secure Admin user:
```bash
npm run seed:admin
```
Notice: When command will finish, you will see the line "Admin created successfully!", finish the process.
### 5. Start the Application
```bash
npm run start:dev
```
The server will start on http://localhost:3000.
## 📚 API Documentation (Swagger)
The API is fully documented using Swagger.

URL: http://localhost:3000/api

You can test all endpoints directly from this interface.

### 🔑 Authentication
Some endpoints (like DELETE /movies/:id) are protected. To test them:

1. Log in via POST /auth/login using the credentials below.
2. Copy the access_token from the response.
3. Click the Authorize 🔒 button at the top of the Swagger page.
4. Paste the token to unlock the protected routes.
