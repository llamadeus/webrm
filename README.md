# WebRM

WebRM is a web-based application for restaurant management that combines modern design principles, type-safe architecture, and real-time communication. It simplifies operations for restaurant owners by providing tools to manage tables, menus, waiters, and orders. Guests can place orders directly from table terminals.

## Features

- **Role-Based Management**: Separate functionalities for admins, waiters, area terminals (kitchen/bar), and table terminals
- **Menu Management**: Add and remove dishes or beverages with ease
- **Real-Time Updates**: Changes are propagated live to all connected clients without manual refreshes
- **Scalable Architecture**: Supports horizontal scaling with real-time communication powered by Valkey
- **User-Friendly UI**: Built with Vue, TailwindCSS, and accessible components from shadcn/ui

## Technologies Used

- **Frontend**: Vue, Pinia, VeeValidate, TailwindCSS
- **Backend**: Express, MongoDB, Valkey, Socket.IO
- **Infrastructure**: Docker, Bun

## Getting Started

### Running with Docker

#### 1. Prepare the Environment
Copy the provided `.env.example` file and configure the environment variables:

```bash
cp .env.example .env
```

Set the following variables in the `.env` file:

- `WEBRM_BACKEND_URL`: URL of the backend
- `WEBRM_FRONTEND_URL`: URL of the frontend
- `WEBRM_SESSION_SECRET`: Secure session secret. Generate one using:

```bash
openssl rand -hex 32
```

#### 2. Start the Application
Run the following command to start WebRM:

```bash
docker compose up -d
```

### Running Manually

#### 1. Install Prerequisites
Ensure the following are installed on your system:

- **Bun** (v1.2.0): [Install Instructions](https://bun.sh/)
- **MongoDB** (v8.0.4): [Installation Guide](https://github.com/mongodb/mongo/tree/r8.0.4)
- **Valkey** (v8.0.2): [Installation Guide](https://github.com/valkey-io/valkey/tree/8.0.2)

#### 2. Configure Environment
Copy `.env.example` files for the backend and frontend, then update their values:

```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

#### 3. Install Dependencies
Install all necessary dependencies:

```bash
bun install
```

#### 4. Build the Frontend
Build the frontend application:

```bash
bun run --filter "webrm-frontend" build
```

#### 5. Start the Backend
Run the backend server:

```bash
bun run --filter "webrm-backend" start
```

#### 6. Serve the Frontend
Serve the frontend assets:

```bash
bunx serve packages/frontend/dist
```

## Deployment

WebRM can be deployed using Docker for consistent environments. The `docker-compose.yaml` file in the repository contains all necessary configurations for running the application.

## Future Improvements

- Add unit test and integration tests
- Implement automated end-to-end tests with Playwright
