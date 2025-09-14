# Persona.io Backend API

A robust, secure Node.js API for context-aware identity management, built with Express, TypeScript, and comprehensive security features.

## 🎯 Overview

The backend provides a secure, scalable API for managing user identities across multiple contexts. It handles authentication, data management, privacy controls, and third-party access requests with enterprise-grade security.

### Key Features

- **JWT Authentication** with secure token management
- **Context-Aware Data Management** for granular privacy control
- **Row Level Security (RLS)** ensuring complete data isolation
- **Comprehensive Input Validation** preventing security vulnerabilities
- **Rate Limiting** and abuse prevention
- **Image Upload** with Supabase Storage integration
- **Identity Request System** for third-party data access
- **Extensive Test Coverage** with Jest

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Express.js API Server                    │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Services   │  Middleware  │  Routes        │
│  ├─auth       │  ├─supabase │  ├─auth      │  ├─/auth       │
│  ├─contexts   │  ├─upload   │  ├─validation│  ├─/contexts   │
│  ├─attributes │  └─identity │  ├─rateLimiter│  ├─/attributes │
│  └─requests   │             │  └─cors      │  └─/requests   │
├─────────────────────────────────────────────────────────────┤
│                    Supabase Integration                     │
│  PostgreSQL Database  │  Authentication  │  File Storage   │
│  ├─Row Level Security │  ├─JWT Tokens    │  ├─Image Upload │
│  ├─Real-time Updates  │  ├─User Sessions │  └─CDN Delivery │
│  └─Automated Backups  │  └─Password Hash │                 │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

**Core Technologies:**

- **Node.js 18+** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type safety and enhanced DX
- **Supabase** - PostgreSQL database and auth
- **JWT** - Stateless authentication tokens

**Security & Middleware:**

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting
- **Joi** - Input validation schemas

**Development & Testing:**

- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting
- **Nodemon** - Development hot reload

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers and business logic
│   │   ├── authController.ts         # User authentication
│   │   ├── contextController.ts      # Context management
│   │   ├── attributeController.ts    # Attribute CRUD
│   │   ├── contextAttributeController.ts  # Privacy matrix
│   │   ├── identityRequestController.ts   # Request handling
│   │   ├── userController.ts         # User operations
│   │   └── uploadController.ts       # File uploads
│   │
│   ├── middleware/            # Request processing middleware
│   │   ├── auth.ts                   # JWT authentication
│   │   ├── validation.ts             # Input validation schemas
│   │   ├── rateLimiter.ts           # Rate limiting config
│   │   └── upload.ts                # Multer file upload
│   │
│   ├── routes/               # API route definitions
│   │   ├── auth.ts                  # Authentication routes
│   │   ├── contexts.ts              # Context CRUD routes
│   │   ├── attributes.ts            # Attribute CRUD routes
│   │   ├── contextAttributes.ts     # Privacy matrix routes
│   │   ├── identityRequests.ts      # Request management routes
│   │   ├── users.ts                 # User search routes
│   │   ├── upload.ts                # File upload routes
│   │   └── index.ts                 # Route aggregation
│   │
│   ├── services/             # External service integrations
│   │   ├── supabase.ts              # Supabase client config
│   │   ├── authService.ts           # Authentication logic
│   │   ├── contextService.ts        # Context business logic
│   │   ├── attributeService.ts      # Attribute operations
│   │   ├── contextAttributeService.ts # Privacy matrix logic
│   │   ├── identityRequestService.ts  # Request processing
│   │   ├── userService.ts           # User operations
│   │   └── uploadService.ts         # File upload handling
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── index.ts                 # Core types and interfaces
│   │   ├── auth.ts                  # Authentication types
│   │   ├── context.ts               # Context types
│   │   ├── attribute.ts             # Attribute types
│   │   └── identityRequest.ts       # Request types
│   │
│   ├── utils/                # Utility functions
│   │   └── helpers.ts               # Common helper functions
│   │
│   ├── __tests__/            # Test suites
│   │   ├── auth.test.ts             # Authentication tests
│   │   ├── contexts.test.ts         # Context management tests
│   │   ├── privacyMatrix.test.ts    # Privacy controls tests
│   │   ├── security.test.ts         # Security vulnerability tests
│   │   ├── setup.ts                 # Test environment setup
│   │   └── jest.setup.ts            # Jest configuration
│   │
│   ├── app.ts                # Express application setup
│   └── server.ts             # Server entry point
│
├── jest.config.js            # Jest testing configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project
- PostgreSQL database (via Supabase)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment configuration:**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_here
   JWT_EXPIRES_IN=7d

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Database setup:**

   ```bash
   # Run the SQL scripts to create tables and policies
   # Scripts are provided in documentation
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   Server will be available at `http://localhost:3001`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start with hot reload (nodemon)
npm run start:dev    # Start with ts-node

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Start compiled JavaScript server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| `POST` | `/api/auth/signup` | User registration | ❌            |
| `POST` | `/api/auth/login`  | User login        | ❌            |
| `GET`  | `/api/auth/me`     | Get current user  | ✅            |

### Context Management

| Method   | Endpoint            | Description        | Auth Required |
| -------- | ------------------- | ------------------ | ------------- |
| `GET`    | `/api/contexts`     | List user contexts | ✅            |
| `POST`   | `/api/contexts`     | Create new context | ✅            |
| `PUT`    | `/api/contexts/:id` | Update context     | ✅            |
| `DELETE` | `/api/contexts/:id` | Delete context     | ✅            |

### Attribute Management

| Method   | Endpoint              | Description          | Auth Required |
| -------- | --------------------- | -------------------- | ------------- |
| `GET`    | `/api/attributes`     | List user attributes | ✅            |
| `POST`   | `/api/attributes`     | Create new attribute | ✅            |
| `PUT`    | `/api/attributes/:id` | Update attribute     | ✅            |
| `DELETE` | `/api/attributes/:id` | Delete attribute     | ✅            |

### Privacy Matrix

| Method   | Endpoint                                          | Description                   | Auth Required |
| -------- | ------------------------------------------------- | ----------------------------- | ------------- |
| `GET`    | `/api/privacy-matrix`                             | Get privacy matrix data       | ✅            |
| `POST`   | `/api/context-attributes`                         | Assign attribute to context   | ✅            |
| `DELETE` | `/api/context-attributes/:contextId/:attributeId` | Remove attribute from context | ✅            |

### Identity Requests

| Method   | Endpoint                               | Description           | Auth Required |
| -------- | -------------------------------------- | --------------------- | ------------- |
| `GET`    | `/api/identity-requests/received`      | Get received requests | ✅            |
| `GET`    | `/api/identity-requests/sent`          | Get sent requests     | ✅            |
| `GET`    | `/api/identity-requests/pending/count` | Get pending count     | ✅            |
| `POST`   | `/api/identity-requests`               | Create new request    | ✅            |
| `POST`   | `/api/identity-requests/:id/respond`   | Respond to request    | ✅            |
| `DELETE` | `/api/identity-requests/:id`           | Delete request        | ✅            |

### File Upload

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| `POST` | `/api/upload/image` | Upload profile image | ✅            |

### User Operations

| Method | Endpoint                    | Description       | Auth Required |
| ------ | --------------------------- | ----------------- | ------------- |
| `GET`  | `/api/users/search/:userId` | Search user by ID | ✅            |

## 🗃 Database Schema

### Core Tables

```sql
-- Users table (custom auth implementation)
users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contexts table (user-defined personas)
contexts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attributes table (user data fields)
attributes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'email', 'phone', 'url', 'image', 'date', 'address')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Context-attribute visibility mapping
context_attributes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  context_id BIGINT REFERENCES contexts(id) ON DELETE CASCADE,
  attribute_id BIGINT REFERENCES attributes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, context_id, attribute_id)
);

-- Identity requests for third-party access
identity_requests (
  id BIGSERIAL PRIMARY KEY,
  requestor_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  requestee_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  context_id BIGINT REFERENCES contexts(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'revoked')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- User-based queries
CREATE INDEX idx_contexts_user_id ON contexts(user_id);
CREATE INDEX idx_attributes_user_id ON attributes(user_id);
CREATE INDEX idx_context_attributes_user_id ON context_attributes(user_id);

-- Identity request queries
CREATE INDEX idx_identity_requests_requestor ON identity_requests(requestor_user_id);
CREATE INDEX idx_identity_requests_requestee ON identity_requests(requestee_user_id);
CREATE INDEX idx_identity_requests_status ON identity_requests(status);
```

## 🔒 Security Features

### Authentication & Authorization

**JWT Implementation:**

- Secure token generation with configurable expiration
- Token validation middleware on protected routes
- Automatic token refresh mechanism
- Logout token invalidation

**Password Security:**

- BCrypt hashing with salt rounds
- Minimum password complexity requirements
- No password exposure in API responses

### Data Protection

**Row Level Security (RLS):**

```sql
-- Example RLS policy for contexts table
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own contexts" ON contexts
  FOR ALL USING (user_id = auth.uid());
```

**Input Validation:**

- Joi schema validation for all endpoints
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization
- File upload restrictions and validation

**Rate Limiting:**

```typescript
// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});
```

### CORS & Headers

```typescript
// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
```

## 🧪 Testing Suite

### Test Coverage

The application includes **47 comprehensive tests** covering:

**Authentication Tests (10 tests):**

- User registration with validation
- Login with correct/incorrect credentials
- JWT token validation and expiration
- Protected route access control

**Context Management Tests (11 tests):**

- CRUD operations for contexts
- User isolation enforcement
- Input validation and error handling

**Privacy Matrix Tests (9 tests):**

- Attribute visibility management
- Cross-user access prevention
- Matrix data integrity

**Security Tests (17 tests):**

- Cross-user data access prevention
- JWT security (expired, malformed, invalid tokens)
- Input validation (SQL injection, XSS)
- Rate limiting functionality
- Password security verification

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

### Test Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testTimeout: 30000,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/__tests__/**"],
};
```

## 📊 Performance Optimizations

### Database Optimizations

- **Indexed Queries**: Strategic indexes on frequently queried columns
- **Connection Pooling**: Supabase handles connection management
- **Query Optimization**: Efficient joins and selective field fetching

### API Performance

- **Compression**: Gzip compression for response bodies
- **Caching Headers**: Appropriate cache control headers
- **Pagination**: Large dataset pagination support
- **Rate Limiting**: Prevents API abuse and ensures fair usage

### File Upload Optimization

```typescript
// Multer configuration for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
```

## 🚀 Deployment

### Environment Variables

**Production Environment:**

```env
# Server
PORT=3001
NODE_ENV=production

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Cloud Deployment Options

**Platform as a Service:**

- Railway
- Heroku
- DigitalOcean App Platform
- Render

**Infrastructure as a Service:**

- AWS EC2 + Application Load Balancer
- Google Cloud Run
- Azure Container Instances

**Serverless:**

- Vercel Functions
- Netlify Functions
- AWS Lambda (with serverless framework)

## 📈 Monitoring & Logging

### Application Logging

```typescript
// Morgan logging configuration
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Custom error logging
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("API Error:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const response: ApiResponse = {
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  };

  res.status(500).json(response);
});
```

### Health Check Endpoint

```typescript
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  });
});
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Run the test suite:**
   ```bash
   npm test
   ```
6. **Commit your changes:**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push to your branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Standards

- **TypeScript Strict Mode**: All code must pass strict type checking
- **ESLint Compliance**: No linting errors allowed
- **Test Coverage**: New features require corresponding tests
- **Documentation**: Update README and inline docs for new features

### Commit Convention

```bash
# Feature additions
feat: add new authentication endpoint

# Bug fixes
fix: resolve memory leak in user service

# Documentation
docs: update API endpoint documentation

# Refactoring
refactor: simplify context validation logic

# Tests
test: add integration tests for privacy matrix
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/) for robust web framework
- [Supabase](https://supabase.com/) for backend-as-a-service
- [Jest](https://jestjs.io/) for comprehensive testing
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

For frontend documentation, see [Frontend README](../frontend/README.md)
