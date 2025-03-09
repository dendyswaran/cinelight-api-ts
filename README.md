# Cinelight API (TypeScript)

A secure and maintainable TypeScript API built with clean architecture principles for the Cinelight quotation and inventory management system.

## Features

- Strict TypeScript configuration
- Clean Architecture following SOLID principles
- TypeORM with PostgreSQL integration
- JWT Authentication
- Comprehensive error handling
- Secure API endpoints following OWASP guidelines

## Requirements

- Node.js 16+
- PostgreSQL 12+
- TypeScript 4.5+

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

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/dendyswaran/cinelight-api-ts.git
   cd cinelight-api-ts
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. Set up the database
   ```bash
   # Create a PostgreSQL database
   createdb cinelight_dev

   # Run migrations
   npm run migration:run
   ```

### Development

Start the development server with hot-reload:
```bash
npm run dev
```

### Build for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Response Format

### Success Response
```json
{
  "status": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message",
  "errorCode": 400
}
```

## Contributing

1. Create feature branches from `main`
2. Follow the established code style and architecture
3. Run linting before committing
   ```bash
   npm run lint
   ```
4. Format code
   ```bash
   npm run format
   ``` 