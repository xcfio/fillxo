# fillxo

A modern full-stack freelance platform built with Next.js, Fastify, and real-time capabilities. Connect service providers with clients, manage contracts, handle payments, and communicate seamlessly.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![Package Manager](https://img.shields.io/badge/pnpm-10.20.0-blue)

## Features

- **User Authentication**: Secure login/registration with email OTP verification
- **Job Management**: Create, browse, and manage job listings
- **Contract Management**: Create, negotiate, and complete contracts
- **Real-time Messaging**: Socket.io powered instant messaging and conversations
- **Notifications System**: Real-time notifications for job updates and messages
- **Payment Processing**: Integrated payment system for transactions
- **Proposals**: Submit and manage proposals on job listings
- **Reviews & Ratings**: Rate and review completed work
- **Search Functionality**: Advanced search for jobs and users
- **User Profiles**: Comprehensive user profiles with ratings and history
- **WebSocket Support**: Real-time features including user status and typing indicators

## Project Structure

```
fillxo/
├── apps/
│   ├── backend/           # Fastify API server
│   └── frontend/          # Next.js web application
├── package.json           # Workspace root configuration
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── turbo.json            # Turborepo configuration
```

### Backend (`apps/backend`)

- **Framework**: Fastify 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **API Documentation**: Swagger/OpenAPI with auto-generated docs
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT with secure cookie storage
- **Validation**: TypeBox schema validation
- **Email**: Resend for transactional emails

**Key Directories**:

- `src/routes/` - API endpoint handlers
- `src/database/` - Drizzle schema definitions
- `src/function/` - Business logic utilities
- `src/plugin/` - Fastify plugin configurations
- `src/socket/` - Socket.io event handlers

### Frontend (`apps/frontend`)

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.io client
- **Markdown**: React Markdown with GitHub Flavored Markdown support
- **UI Components**: Custom component library in `src/components/`

**Key Directories**:

- `src/app/` - Next.js pages and layouts
- `src/components/` - Reusable React components
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Getting Started

### Prerequisites

- **Node.js**: v22 or higher
- **pnpm**: v10.20.0 or higher (specified in `package.json`)
- **PostgreSQL**: Database for the backend
- **Environment Variables**: Create `.env` files for configuration

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/xcfio/fillxo.git
    cd fillxo
    ```

2. **Install dependencies**:

    ```bash
    pnpm install
    ```

3. **Configure environment variables**:

    **Backend** (`apps/backend/.env`):

    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/fillxo
    JWT_SECRET=your_jwt_secret_key
    RESEND_API_KEY=your_resend_api_key
    # Add other required environment variables
    ```

    **Frontend** (`apps/frontend/.env.local`):

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    # Add other frontend configuration
    ```

4. **Setup the database**:
    ```bash
    cd apps/backend
    node --run gen    # Generate migrations
    node --run db     # Open Drizzle Studio
    ```

## Development Scripts

Run from the workspace root:

```bash
# Start all apps in development mode
node --run dev

# Build all apps
node --run build

# Run linters/type checks across all apps
node --run lint

# Format code with Prettier
node --run fmt

# Run tests
node --run test
```

### Individual App Scripts

**Backend** (`apps/backend`):

```bash
node --run dev         # Start development server with file watching
node --run start       # Run production server
node --run db          # Open Drizzle Studio on port 4000
node --run gen         # Generate database migrations
node --run test        # Type check only
```

**Frontend** (`apps/frontend`):

```bash
node --run dev         # Start Next.js dev server on port 7700
node --run build       # Build for production
node --run start       # Start production server
node --run test        # Type check only
```

## Accessing the Application

Once development servers are running:

- **Frontend**: http://localhost:7700
- **Backend API**: http://localhost:7200
- **API Documentation**: http://localhost:3000/documentation
- **Drizzle Studio**: http://localhost:4000 (when running `node --run db`)

## Tech Stack

### Core

- **Language**: TypeScript 6.0
- **Monorepo**: Turbo 2.x
- **Package Manager**: pnpm 10.20

### Backend

- Fastify 5.x
- Drizzle ORM 0.45
- PostgreSQL
- Socket.io 4.x
- TypeBox 1.x
- Resend (Email)

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- Socket.io Client 4.x
- Lucide React (Icons)

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - User logout

### Jobs

- `GET /api/job` - List all jobs
- `GET /api/job/:id` - Get job details
- `POST /api/job` - Create new job
- `PUT /api/job/:id` - Update job
- `DELETE /api/job/:id` - Delete job
- `GET /api/job/:id/proposals` - Get job proposals

### Contracts

- `GET /api/contracts` - List contracts
- `POST /api/contracts` - Create contract
- `GET /api/contracts/:id` - Get contract details
- `PUT /api/contracts/:id/complete` - Mark contract complete
- `PUT /api/contracts/:id/reject` - Reject contract

### Messages

- `GET /api/messages` - Get all conversations
- `GET /api/messages/:conversationId` - Get messages in conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### Additional Endpoints

- `/api/proposals` - Proposal management
- `/api/payments` - Payment processing
- `/api/reviews` - Review submission
- `/api/notifications` - Notification management
- `/api/search` - Global search
- `/api/user/*` - User profile management

## Real-time Features

The application uses Socket.io for real-time communication:

### Socket Events

- `user_connected` - User comes online
- `user_disconnected` - User goes offline
- `typing` - User is typing indicator
- `read` - Message read indicator
- Additional custom events in `apps/backend/src/socket/`

## Development Workflow

1. **Create a feature branch**: `git checkout -b feature/your-feature`
2. **Make your changes**: Edit files in `apps/backend/` or `apps/frontend/`
3. **Format code**: `node --run fmt`
4. **Type check**: `node --run lint`
5. **Test your changes**: `node --run test`
6. **Commit and push**: Follow conventional commits
7. **Create a pull request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links & Community

| Resource          | URL                                    |
| ----------------- | -------------------------------------- |
| GitHub repository | https://github.com/xcfio/fillxo        |
| Homepage          | https://github.com/xcfio/fillxo#readme |
| Bug reports       | https://github.com/xcfio/fillxo/issues |

### Discord

Join the community on Discord for help, and discussion:

**https://discord.gg/FaCCaFM74Q**

---

Made with ❤️ by [xcfio](https://github.com/xcfio)
