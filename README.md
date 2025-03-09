# Cinelight API

A TypeScript API for Cinelight with strict TypeScript and SOLID principles following clean architecture.

## Features

- Secure authentication with JWT
- TypeScript strict mode
- PostgreSQL database with TypeORM
- Clean architecture implementation

## Project Structure

```
src/
├── domain/             # Enterprise business rules
│   ├── entities/       # Enterprise entities
│   ├── enums/          # Enumerations
│   └── interfaces/     # Enterprise interfaces
├── application/        # Application business rules
├── infrastructure/     # Frameworks, drivers, tools
│   ├── config/         # Configuration
│   ├── database/       # Database setup
│   └── services/       # External services
└── interfaces/         # Interface adapters
    └── http/           # HTTP layer
        ├── controllers/
        ├── middleware/
        └── routes/
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cinelight_dev

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=*
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Create an admin user:

```bash
npm run create:admin
```

This will create a user with the following credentials:
- Username: admin
- Password: admin

### Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login with username and password
- `GET /api/v1/auth/me` - Get current user (requires authentication)

## License

ISC 