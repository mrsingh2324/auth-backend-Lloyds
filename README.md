# Node.js Authentication API

A simple and secure authentication and authorization API built with Node.js, Express, and SQLite.

## Features

- User registration and login with JWT authentication
- Role-based access control (user and admin roles)
- Password hashing with bcrypt
- Protected routes with JWT verification
- User profile management
- Admin dashboard for user management
- Input validation
- Error handling
- SQLite database for data persistence

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- SQLite (included with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd node-auth-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or start in production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## API Documentation

You can access the interactive API documentation at `/api-docs` when the server is running. The documentation provides:

- Detailed endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication setup

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Required fields: `username`, `email`, `password`
  - Returns: User object and JWT token

- **POST /api/auth/login**
  - Login with email and password
  - Required fields: `email`, `password`
  - Returns: User object and JWT token

### User Profile (Requires Authentication)

- **GET /api/auth/me**
  - Get current user's profile
  - Requires: Valid JWT token in Authorization header

- **PUT /api/auth/profile**
  - Update current user's profile
  - Optional fields: `username`, `email`, `password`
  - Requires: Valid JWT token in Authorization header

- **DELETE /api/auth/account**
  - Delete current user's account
  - Requires: Valid JWT token in Authorization header

### Admin (Requires Admin Role)

- **GET /api/auth/users**
  - Get all users (admin only)
  - Requires: Admin role

## Default Admin Account

A default admin account is automatically created when the database initializes:

- **Username:** admin
- **Email:** admin@example.com
- **Password:** admin123

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation on all routes
- SQL injection prevention with parameterized queries
- Environment variables for sensitive data
- CORS enabled

## Error Handling

The API returns appropriate HTTP status codes and JSON responses for errors:

- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication required
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

## Database

The application uses SQLite with the following schema:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

- `PORT` - Port number for the server (default: 3000)
- `JWT_SECRET` - Secret key for signing JWT tokens
- `JWT_EXPIRE` - Expiration time for JWT tokens (e.g., '24h')

## Testing

You can test the API using:

1. **Interactive Swagger UI** at `http://localhost:3000/api-docs`
2. **Postman** or **Insomnia**
3. **cURL** commands

### Example cURL Commands

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get user profile (requires authentication):**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
