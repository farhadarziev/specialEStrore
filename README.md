# Special Equipment Online Store

A full-stack online store for special-purpose vehicle equipment.  
The project combines a Spring Boot REST backend with a browser-based frontend and supports product browsing, authentication, cart management, orders, user profiles, and administrative operations.

## Main Features

- User registration and login
- JWT-based authentication
- BCrypt password hashing
- Product catalog with category filtering and search
- Product details pages
- Persistent shopping cart
- Order creation from the current cart
- Personal order history
- User profile
- Administrative product and order management
- Initial product data loading
- REST communication between backend and frontend

## Technology Stack

| Area | Technologies |
|---|---|
| Backend | Java 17, Spring Boot, Spring MVC |
| Security | Spring Security, JWT, BCrypt |
| Data | PostgreSQL, Spring Data JPA, Hibernate |
| Frontend | HTML, CSS, JavaScript, Fetch API |
| Testing | JUnit, Spring Boot Test |
| Version Control | Git, GitHub |

## Architecture

The backend follows a layered architecture.

```text
src/main/java/com/example/estore
├── controller      # HTTP endpoints
├── service         # Business logic
├── repository      # Database access
├── entity          # JPA entities
├── dto             # API request and response models
├── mapper          # Entity-to-DTO conversion
├── security        # JWT and Spring Security configuration
└── config          # Application initialization
```

Frontend files are stored in:

```text
src/main/resources/static
├── css
├── images
├── js
└── *.html
```

Typical request flow:

```text
Browser
  ↓ Fetch API
REST Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

## Main API Groups

| Group | Base Path | Purpose |
|---|---|---|
| Authentication | `/auth` | Registration and login |
| Products | `/api/products` | Catalog, search, and product details |
| Cart | `/api/cart` | Add, decrease, remove, and clear items |
| Orders | `/api/orders` | Create and view personal orders |
| User | `/api/user` | Current-user profile |
| Administration | `/api/admin` | Product and order management |

## Running Locally

### Requirements

- Java 17
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/farhadarziev/specialEStrore.git
cd specialEStrore
```

> Recommended repository name: `special-equipment-store`.

### 2. Create the database

```sql
CREATE DATABASE estore_db;
```

### 3. Configure PostgreSQL

Set the database connection in `src/main/resources/application.properties`, preferably through environment variables:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/estore_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}
```

### 4. Run the application

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux or macOS:

```bash
./mvnw spring-boot:run
```

Open the application:

```text
http://localhost:8080/main.html
```

## Main Pages

- `/main.html` — home page
- `/catalog.html` — product catalog
- `/product.html` — product details
- `/cart.html` — shopping cart
- `/order_history.html` — order history
- `/profile.html` — user profile
- `/auth.html` — registration and login
- `/admin.html` — administrator panel

## Data Initialization

The application adds an initial product catalog when the database is empty.

Administrator credentials must not be hardcoded in source code. For a public repository, configure them through environment variables or create the administrator manually in the database.

## Security Note

Before publishing the project:

- remove database passwords from tracked configuration files;
- remove hardcoded administrator credentials;
- restrict `/api/admin/**` to users with the `ADMIN` role;
- keep secrets in environment variables.

