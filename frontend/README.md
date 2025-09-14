# Persona.io Frontend

A modern React application for context-aware identity management, built with TypeScript, Vite, and TailwindCSS.

## 🎯 Overview

The frontend provides an intuitive interface for users to manage their digital identity across multiple contexts. Key features include:

- **Context Management**: Create and manage different persona contexts (work, personal, public)
- **Attribute Control**: Add, edit, and organize personal attributes with various data types
- **Privacy Matrix**: Visual interface for controlling attribute visibility per context
- **Profile Preview**: Real-time preview of how profiles appear in different contexts
- **Identity Requests**: Manage incoming and outgoing identity access requests
- **PDF Export**: Generate professional context-specific profile documents

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework for rapid UI development
- **TanStack Query** - Powerful data fetching and state management
- **React Router** - Client-side routing
- **jsPDF** - PDF generation for profile exports

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # App-level configuration
│   │   └── ui/           # Core UI components and primitives
│   ├── context/          # React Context providers
│   ├── features/         # Feature-based modules
│   │   ├── auth/         # Authentication components and logic
│   │   └── dashboard/    # Main dashboard functionality
│   │       ├── components/  # Feature-specific components
│   │       ├── hooks/      # Custom hooks for data fetching
│   │       └── ui/         # UI components for dashboard
│   ├── lib/              # Utility libraries
│   │   ├── api/          # API client functions
│   │   └── queryClient.ts # TanStack Query configuration
│   ├── pages/            # Top-level page components
│   └── types/            # TypeScript type definitions
├── package.json
└── vite.config.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run type-check   # Run TypeScript type checking
```

## 🧩 Key Components

### Dashboard Components

**Context Management:**
- `ContextGrid` - Display all user contexts in a card layout
- `ContextCard` - Individual context with stats and actions
- `CreateContextModal` - Form for creating new contexts
- `ContextPreviewModal` - Preview context-specific profiles

**Attribute Management:**
- `AttributeGrid` - Display all user attributes
- `AttributeCard` - Individual attribute with type-specific rendering
- `CreateAttributeModal` - Form with drag-and-drop image upload
- `AttributeRenderer` - Type-aware attribute value display

**Privacy Controls:**
- `PrivacyMatrix` - Interactive table for visibility management
- `ProfilePreview` - Dynamic profile preview with context switching
- `ContextPreviewModal` - Modal preview of context profiles

**Identity Requests:**
- `IdentityRequests` - Manage incoming requests (accordion UI)
- `SentRequests` - Track outgoing requests
- `RequestAccessPage` - Search and request user contexts

### UI Primitives

Located in `src/app/ui/`, these provide consistent styling:
- `Badge` - Status indicators and labels
- `Toggle` - On/off switches for privacy controls
- `ProgressBar` - Visual progress indicators
- `Icons` - SVG icon components

### Authentication

- `AuthContext` - Global authentication state management
- `ProtectedRoute` - Route protection wrapper
- `LoginPage` / `SignupPage` - Authentication forms

## 🎨 Styling & Design

### TailwindCSS Configuration

The application uses a custom Tailwind configuration with:
- **Brand colors**: Indigo/purple gradient system
- **Typography**: Responsive text scales
- **Spacing**: Consistent spacing system
- **Animations**: Smooth transitions and hover effects

### Design Principles

- **Consistent Visual Hierarchy**: Clear typography and spacing
- **Responsive Design**: Mobile-first approach
- **Accessible**: WCAG compliant color contrasts and keyboard navigation
- **Modern Aesthetics**: Clean, professional interface with subtle animations

### Color Palette

```css
/* Primary Brand Colors */
--indigo-600: #6366f1;
--purple-600: #9333ea;

/* Status Colors */
--green-500: #10b981;  /* Success */
--red-500: #ef4444;    /* Error */
--yellow-500: #f59e0b; /* Warning */
--blue-500: #3b82f6;   /* Info */
```

## 🔧 State Management

### TanStack Query

Used for server state management with:
- **Caching**: Intelligent background refetching
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Robust error boundaries
- **Loading States**: Consistent loading indicators

### Query Key Organization

```typescript
// Centralized query keys
export const queryKeys = {
  contexts: ['contexts'] as const,
  attributes: ['attributes'] as const,
  privacyMatrix: ['privacy-matrix'] as const,
  identityRequests: ['identity-requests'] as const,
  // ... more keys
};
```

### React Context

- `AuthContext` - User authentication state
- Global state for user preferences and UI state

## 🔒 Security Features

### Authentication

- **JWT Token Management**: Secure token storage in localStorage
- **Automatic Token Refresh**: Seamless session management
- **Route Protection**: Authenticated route guards

### Data Validation

- **Input Sanitization**: XSS prevention
- **Type Safety**: TypeScript for compile-time safety
- **Form Validation**: Client-side validation with server confirmation

### Privacy Controls

- **Granular Permissions**: Fine-grained attribute visibility
- **User Consent**: Explicit consent for data sharing
- **Audit Trail**: Track all data access and sharing

## 📱 Responsive Design

The application is fully responsive with breakpoints:

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

Key responsive features:
- **Mobile Navigation**: Hamburger menu for small screens
- **Adaptive Layouts**: Grid layouts that stack on mobile
- **Touch-Friendly**: Appropriate touch targets
- **Performance**: Optimized images and lazy loading

## 🧪 Testing

### Test Structure

```bash
# Component tests
npm run test

# E2E tests (if implemented)
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Testing Philosophy

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Feature workflows
- **E2E Tests**: Full user journeys
- **Accessibility Tests**: Screen reader compatibility

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:
- **Code Splitting**: Automatic vendor and route-based splitting
- **Asset Optimization**: Minified CSS and JavaScript
- **Tree Shaking**: Unused code elimination
- **Modern Output**: ES modules for modern browsers

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.persona.io

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# External Services
VITE_SENTRY_DSN=your_sentry_dsn
```

### Deployment Options

**Static Hosting (Recommended):**
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

**Container Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔍 Development Guidelines

### Code Style

- **ESLint**: Consistent code formatting
- **Prettier**: Automatic code formatting
- **TypeScript Strict Mode**: Enhanced type safety
- **Component Naming**: PascalCase for components, camelCase for functions

### Best Practices

- **Component Composition**: Favor composition over inheritance
- **Custom Hooks**: Extract reusable logic
- **Error Boundaries**: Graceful error handling
- **Performance**: Use React.memo and useMemo appropriately

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Bug fixes
git checkout -b fix/bug-description
git commit -m "fix: resolve bug description"
git push origin fix/bug-description
```

## 📚 Documentation

### Component Documentation

Each component includes:
- **Purpose**: What the component does
- **Props**: TypeScript interfaces
- **Examples**: Usage examples
- **Accessibility**: ARIA labels and keyboard support

### API Integration

API calls are centralized in `src/lib/api/` with:
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Consistent error responses
- **Retry Logic**: Automatic retry for failed requests

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Code Review Checklist

- [ ] TypeScript compilation passes
- [ ] ESLint passes without warnings
- [ ] Components are accessible
- [ ] Tests are included for new features
- [ ] Documentation is updated

## 📄 License

MIT License - see the [LICENSE](../LICENSE) file for details.

---

For backend API documentation, see [Backend README](../backend/README.md)