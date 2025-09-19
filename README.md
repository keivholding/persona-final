# 🔐 Persona.io - Context-Aware Identity Management

<div align="center">

![Persona.io Logo](https://img.shields.io/badge/🔒-Persona.io-blue?style=for-the-badge&labelColor=1e40af&color=3b82f6)

**A sophisticated identity management platform that empowers users with granular control over their personal data sharing across different contexts.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

[🚀 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 🌟 Overview

Persona.io revolutionizes how users manage their digital identity by introducing **context-aware data sharing**. Instead of having a single, static profile, users can create multiple contexts (personas) and selectively share different attributes based on the situation - whether it's professional networking, social interactions, or public visibility.

### 🎯 Key Features

- **🎭 Multiple Contexts**: Create unlimited personas for different life aspects
- **🔒 Granular Privacy Control**: Choose exactly what to share in each context
- **📊 Interactive Privacy Matrix**: Visual interface for managing attribute visibility
- **🔄 Real-time Preview**: See exactly what others will see in each context
- **📱 Responsive Design**: Seamless experience across all devices
- **🛡️ Enterprise Security**: JWT authentication, rate limiting, and data encryption
- **📄 PDF Export**: Generate professional profile cards for any context
- **🔍 Identity Requests**: Secure system for requesting access to specific contexts

---

## 🏗️ Architecture

### Frontend Stack

- **React 19** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **TailwindCSS** for modern, responsive styling
- **TanStack Query** for efficient server state management
- **React Router** for client-side routing

### Backend Stack

- **Node.js** with Express.js framework
- **TypeScript** for enhanced developer experience
- **PostgreSQL** via Supabase for robust data management
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers

### Database Design

- **Row Level Security (RLS)** for data isolation
- **Optimized queries** with proper indexing
- **Cascading relationships** for data integrity
- **Audit trails** for security monitoring

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (or Supabase account)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/persona-io.git
cd persona-io
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API endpoint

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

---

## 📚 Documentation

### API Endpoints

#### Authentication

```http
POST /api/auth/signup     # User registration
POST /api/auth/login      # User authentication
GET  /api/auth/me         # Get current user
```

#### Contexts Management

```http
GET    /api/contexts      # List user contexts
POST   /api/contexts      # Create new context
PUT    /api/contexts/:id  # Update context
DELETE /api/contexts/:id  # Delete context
```

#### Attributes Management

```http
GET    /api/attributes         # List user attributes
POST   /api/attributes         # Create new attribute
PUT    /api/attributes/:id     # Update attribute
DELETE /api/attributes/:id     # Delete attribute
POST   /api/upload            # Upload attribute images
```

#### Privacy Matrix

```http
GET /api/privacy-matrix        # Get privacy settings
PUT /api/privacy-matrix        # Update privacy settings
GET /api/profile/preview/:contextId  # Preview profile in context
```

### Database Schema

#### Core Tables

- **users**: User accounts and authentication
- **contexts**: User-defined contexts/personas
- **attributes**: User profile attributes
- **context_attributes**: Privacy matrix mapping
- **identity_requests**: Access request system

### Security Features

- **JWT Authentication** with secure token management
- **Rate Limiting** to prevent API abuse
- **Input Validation** using Joi schemas
- **SQL Injection Protection** via parameterized queries
- **CORS Configuration** for cross-origin security
- **Password Hashing** with bcrypt and salt

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage report
npm test -- --watch        # Run in watch mode
```

**Test Coverage**: 47 comprehensive tests covering:

- Authentication flows
- Context management
- Privacy matrix operations
- Security validations
- Cross-user access protection

### Frontend Testing

```bash
cd frontend
npm run test               # Run component tests
npm run test:e2e          # Run end-to-end tests
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

```bash
# Build the application
npm run build

# Set environment variables
export DATABASE_URL="your-postgres-url"
export JWT_SECRET="your-jwt-secret"
export NODE_ENV="production"

# Start production server
npm start
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=development
PORT=3000
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Persona.io
```

---

## 📊 Performance Metrics

Based on comprehensive evaluation testing:

| Metric                           | Result        | Status           |
| -------------------------------- | ------------- | ---------------- |
| **Task Success Rate**            | 100%          | ✅ Excellent     |
| **System Usability Scale (SUS)** | 85.0/100      | ✅ Above Average |
| **API Response Time**            | <200ms avg    | ✅ Fast          |
| **Test Coverage**                | 47 test cases | ✅ Comprehensive |
| **Security Tests**               | All passed    | ✅ Secure        |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Jest** for testing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Supabase** for providing excellent backend-as-a-service
- **Vercel** for seamless frontend deployment
- **TailwindCSS** for beautiful, responsive design system
- **React Query** for powerful data synchronization

---

## 📞 Support

- **Documentation**: [docs.persona.io](#)
- **Email**: support@persona.io
- **Discord**: [Join our community](#)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/persona-io/issues)

---

<div align="center">

**Built with ❤️ for privacy-conscious users**

[⬆ Back to Top](#-personaio---context-aware-identity-management)

</div>
