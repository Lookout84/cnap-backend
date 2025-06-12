# CNAP Backend

This is the backend for the Центр надання адміністративних послуг (Administrative Services Center) website, built using Node.js, TypeScript, PostgreSQL, and Prisma.

## Project Structure

The project is organized as follows:

```
cnap-backend
├── src
│   ├── app.ts                    # Application entry point
│   ├── config
│   │   ├── database.ts           # Database configuration
│   │   └── environment.ts        # Environment variables
│   ├── controllers
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── news.controller.ts    # News management
│   │   ├── services.controller.ts # Administrative services
│   │   ├── queue.controller.ts   # Queue management
│   │   └── consultation.controller.ts # Online consultations
│   ├── middlewares
│   │   ├── auth.middleware.ts    # Authentication middleware
│   │   ├── error.middleware.ts   # Error handling
│   │   └── validation.middleware.ts # Input validation
│   ├── models
│   │   └── index.ts              # Model exports
│   ├── prisma
│   │   └── schema.prisma         # Prisma schema
│   ├── routes
│   │   ├── auth.routes.ts        # Auth routes
│   │   ├── news.routes.ts        # News routes
│   │   ├── services.routes.ts    # Services routes
│   │   ├── queue.routes.ts       # Queue routes
│   │   ├── consultation.routes.ts # Consultation routes
│   │   └── index.ts              # Route registration
│   ├── services
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── news.service.ts       # News business logic
│   │   ├── services.service.ts   # Services business logic
│   │   ├── queue.service.ts      # Queue business logic
│   │   └── consultation.service.ts # Consultation business logic
│   └── types
│       └── index.ts              # Type definitions
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js                # Testing configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- TypeScript

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/cnap-backend.git
   cd cnap-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and add your database connection details:

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
   ```

4. Run Prisma migrations:

   ```
   npx prisma migrate dev --name init
   ```

### Running the Application

To start the application, run:

```
npm run start
```

### Testing

To run tests, use:

```
npm run test
```

## Features

- **News Section**: Manage news articles with create, update, and delete functionalities.
- **Services List**: View and manage the list of administrative services offered.
- **Online Consultations**: Schedule and manage online consultations.
- **Queue Management**: Manage appointments and queue for services.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.