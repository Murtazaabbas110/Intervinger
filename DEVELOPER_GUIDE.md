# Intervinger - Developer Guide

## Table of Contents

1. [Code Style Guide](#code-style-guide)
2. [Project Structure](#project-structure)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [Database Operations](#database-operations)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Git Workflow](#git-workflow)
9. [Common Tasks](#common-tasks)

---

## Code Style Guide

### General Principles

- **Readability**: Code should be easy to understand
- **Consistency**: Follow existing patterns in codebase
- **Modularity**: Separate concerns into distinct modules
- **DRY**: Don't Repeat Yourself - extract reusable logic
- **SOLID**: Follow SOLID principles where applicable

### JavaScript/TypeScript Style

#### Naming Conventions

```javascript
// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = "http://localhost:5000/api";
const MAX_RETRIES = 3;

// Classes - PascalCase
class UserService {}
class SessionManager {}

// Functions & Variables - camelCase
function fetchUserSessions() {}
const isUserAuthenticated = true;
const getUserById = (id) => {};

// Private functions - prefix with underscore (convention)
const _validateEmail = (email) => {};
```

#### Code Structure

```javascript
// 1. Imports
import express from 'express';
import { config } from 'dotenv';

// 2. Constants
const API_PORT = 5000;
const DEFAULT_TIMEOUT = 5000;

// 3. Type definitions / Interfaces
interface ISession {
  id: string;
  status: 'active' | 'completed';
}

// 4. Main logic
function createSession(data) {
  // Implementation
}

// 5. Exports
export default createSession;
```

#### Comments and Documentation

```javascript
/**
 * Fetches user sessions from database
 *
 * @param {string} userId - The user's Clerk ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Max results to return
 * @param {number} options.offset - Results offset for pagination
 * @returns {Promise<Array>} Array of session objects
 * @throws {Error} If database query fails
 *
 * @example
 * const sessions = await fetchUserSessions('user_123', { limit: 10 });
 */
async function fetchUserSessions(userId, options = {}) {
  const { limit = 10, offset = 0 } = options;
  // Implementation
}
```

#### Error Handling

```javascript
// Good - descriptive error messages
if (!userId) {
  throw new Error("User ID is required to fetch sessions");
}

// Good - error context
try {
  await database.connect();
} catch (error) {
  throw new Error(`Failed to connect to database: ${error.message}`);
}

// Avoid - generic messages
if (!userId) {
  throw new Error("Error");
}
```

### React Component Style

#### Functional Components

```javascript
/**
 * SessionCard Component
 *
 * Displays a session in a card format with quick actions
 *
 * @component
 * @param {Object} props
 * @param {string} props.sessionId - Session ID
 * @param {Object} props.session - Session data
 * @param {Function} props.onJoin - Callback when joining session
 * @returns {JSX.Element}
 */
export function SessionCard({ sessionId, session, onJoin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      await onJoin(sessionId);
    } catch (error) {
      console.error("Failed to join session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{session.title}</h3>
      <p>{session.description}</p>
      <button onClick={handleJoin} disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Session"}
      </button>
    </div>
  );
}
```

#### Props Validation

```javascript
// Using PropTypes (for older projects)
import PropTypes from "prop-types";

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["active", "completed", "paused"]),
  }).isRequired,
  onJoin: PropTypes.func.isRequired,
};
```

### CSS/Tailwind Style

```javascript
// Use Tailwind utility classes
className =
  "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors";

// Complex styles in components
const buttonClasses = `
  bg-gradient-to-r from-blue-500 to-purple-600
  hover:shadow-lg
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;
```

---

## Project Structure

### Directory Organization

```
Intervinger/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── controllers/
│   │   │   ├── chatController.js  # Chat logic
│   │   │   └── sessionController.js # Session CRUD
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   └── sessionRoutes.js
│   │   ├── models/
│   │   │   ├── Session.js         # MongoDB schema
│   │   │   └── User.js
│   │   ├── middleware/
│   │   │   └── protectRoute.js    # Auth middleware
│   │   └── lib/
│   │       ├── db.js              # Database connection
│   │       ├── env.js             # Environment config
│   │       ├── stream.js          # Stream.io setup
│   │       └── inngest.js         # Workflow setup
│   ├── .env                        # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # Entry point
│   │   ├── App.jsx                # Root component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   └── SessionPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CodeEditorPanel.jsx
│   │   │   ├── VideoCallUI.jsx
│   │   │   └── ... (other components)
│   │   ├── hooks/
│   │   │   ├── useSessions.js
│   │   │   └── useStreamClient.js
│   │   ├── api/
│   │   │   ├── sessions.js        # Session API calls
│   │   │   └── auth.js
│   │   ├── lib/
│   │   │   ├── axios.js           # HTTP client setup
│   │   │   ├── stream.js          # Stream client setup
│   │   │   ├── piston.js          # Code execution
│   │   │   └── utils.js           # Utility functions
│   │   ├── data/
│   │   │   └── problems.js        # Problem definitions
│   │   └── index.css              # Global styles
│   ├── .env.local                 # Environment variables
│   └── package.json
│
├── README.md                       # Main documentation
├── SETUP_GUIDE.md                 # Setup instructions
├── API_DOCUMENTATION.md           # API reference
├── ARCHITECTURE.md                # System design
├── FEATURES_GUIDE.md              # Feature documentation
└── CONTRIBUTING.md                # Contribution guidelines
```

### Adding New Features

#### Adding a New API Endpoint

1. **Create Model** (if needed):

```javascript
// backend/src/models/NewModel.js
import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("New", newSchema);
```

2. **Create Controller**:

```javascript
// backend/src/controllers/newController.js
export async function getNewItems(req, res) {
  try {
    const items = await NewModel.find({ userId: req.userId });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

3. **Add Routes**:

```javascript
// backend/src/routes/newRoutes.js
import express from "express";
import { getNewItems } from "../controllers/newController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/", protectRoute, getNewItems);
export default router;
```

4. **Register Routes**:

```javascript
// backend/src/server.js
import newRoutes from "./routes/newRoutes.js";
app.use("/api/new", newRoutes);
```

#### Adding a New React Component

1. **Create Component**:

```javascript
// frontend/src/components/NewComponent.jsx
export function NewComponent({ data, onAction }) {
  return <div>{/* Component JSX */}</div>;
}
```

2. **Add Hook if Needed**:

```javascript
// frontend/src/hooks/useNew.js
import { useQuery } from "@tanstack/react-query";
import { fetchNewData } from "../api/new.js";

export function useNew(id) {
  return useQuery({
    queryKey: ["new", id],
    queryFn: () => fetchNewData(id),
  });
}
```

3. **Use in Pages**:

```javascript
// frontend/src/pages/NewPage.jsx
import { NewComponent } from "../components/NewComponent";
import { useNew } from "../hooks/useNew";

export default function NewPage() {
  const { data, isLoading } = useNew("id");

  if (isLoading) return <div>Loading...</div>;
  return <NewComponent data={data} />;
}
```

---

## Frontend Development

### Setup Development Environment

```bash
cd frontend
npm install
npm run dev
```

### React Query Setup

```javascript
// frontend/src/lib/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});
```

### Axios Interceptors

```javascript
// frontend/src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Common Development Tasks

#### Fetching Data

```javascript
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data } = await api.get("/sessions");
      return data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}
```

#### Mutation (Create/Update)

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

function CreateSessionComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (sessionData) => {
      const { data } = await api.post("/sessions", sessionData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const handleCreate = async (formData) => {
    await mutation.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleCreate}>
      {/* Form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

---

## Backend Development

### Setup Development Environment

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create `.env` with all required variables (see SETUP_GUIDE.md).

### Express Middleware

```javascript
// Custom middleware example
import { clerkMiddleware } from "@clerk/express";

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL }));
app.use(clerkMiddleware());

// Custom auth middleware
export function protectRoute(req, res, next) {
  if (!req.auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
```

### Error Handling

```javascript
// Consistent error response
function sendError(res, statusCode, errorCode, message) {
  res.status(statusCode).json({
    success: false,
    error: errorCode,
    message: message,
  });
}

// Usage
if (!sessionId) {
  return sendError(res, 400, "INVALID_ID", "Session ID is required");
}
```

### Async Error Wrapper

```javascript
// Wrapper for async route handlers
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
router.get(
  "/sessions/:id",
  asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);
    res.json(session);
  }),
);
```

---

## Database Operations

### MongoDB Connection

```javascript
// backend/src/lib/db.js
import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
```

### Mongoose Schema Example

```javascript
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  interviewerId: {
    type: String,
    required: true,
    index: true,
  },
  intervieweeId: {
    type: String,
    required: true,
    index: true,
  },
  problemId: String,
  code: String,
  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  completedAt: Date,
});

// Indexes for performance
sessionSchema.index({ interviewerId: 1, createdAt: -1 });
sessionSchema.index({ intervieweeId: 1, createdAt: -1 });

export default mongoose.model("Session", sessionSchema);
```

### Query Operations

```javascript
// Find operations
const sessions = await Session.find({ userId: "123" });
const session = await Session.findById(sessionId);
const activeSession = await Session.findOne({
  interviewerId: "123",
  status: "active",
});

// Pagination
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;

const sessions = await Session.find({ userId: "123" })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await Session.countDocuments({ userId: "123" });

// Update operations
const updated = await Session.findByIdAndUpdate(
  sessionId,
  { status: "completed" },
  { new: true }, // Return updated document
);

// Delete operations
await Session.deleteOne({ _id: sessionId });
```

---

## Testing

### Frontend Testing (Jest + React Testing Library)

```javascript
// __tests__/components/SessionCard.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionCard } from "../components/SessionCard";

describe("SessionCard", () => {
  it("renders session title", () => {
    const session = { title: "Two Sum" };
    render(<SessionCard session={session} />);
    expect(screen.getByText("Two Sum")).toBeInTheDocument();
  });

  it("calls onJoin when join button clicked", async () => {
    const onJoin = jest.fn();
    const session = { title: "Two Sum" };
    render(<SessionCard session={session} onJoin={onJoin} />);

    const joinBtn = screen.getByRole("button", { name: /join/i });
    await userEvent.click(joinBtn);

    expect(onJoin).toHaveBeenCalled();
  });
});
```

### Backend Testing (Jest + Supertest)

```javascript
// __tests__/routes/sessions.test.js
import request from "supertest";
import app from "../server";

describe("POST /api/sessions", () => {
  it("creates a new session", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        problemId: "two-sum",
        intervieweeId: "user_123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data._id).toBeDefined();
  });
});
```

---

## Debugging

### Frontend Debugging

1. **Browser DevTools**
   - Press F12 or Right-click → Inspect
   - Console tab for errors/logs
   - Network tab for API calls
   - Application tab for storage

2. **React DevTools Extension**

   ```
   Chrome: React Developer Tools extension
   - Inspect component hierarchy
   - Check props and state
   - Trace re-renders
   ```

3. **Redux DevTools** (if using Redux)
   ```javascript
   // Monitor state changes
   // Time-travel debugging
   // Action history
   ```

### Backend Debugging

1. **Logging**

```javascript
import debug from "debug";
const log = debug("app:session");

log("Creating session:", sessionData);
log("Session created:", createdSession);
```

2. **Node Debugger**

```bash
node --inspect src/server.js
# Open chrome://inspect
```

3. **Error Logging**

```javascript
console.error("Error:", error);
console.error("Stack:", error.stack);
```

---

## Git Workflow

### Branch Naming

```
feature/feature-name         # New feature
bugfix/bug-description       # Bug fix
refactor/refactor-name       # Code refactoring
docs/documentation-update    # Documentation
chore/maintenance-task       # Maintenance
```

### Commit Messages

```
Type: Description

feat: Add real-time code collaboration
fix: Resolve chat message ordering issue
docs: Add API documentation for sessions
refactor: Simplify session controller logic
test: Add unit tests for authentication
chore: Update dependencies
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Commit with clear messages
4. Push to repository
5. Create Pull Request with description
6. Address review comments
7. Merge when approved

---

## Common Tasks

### Adding a New Problem

```javascript
// frontend/src/data/problems.js
export const PROBLEMS = {
  "new-problem": {
    id: "new-problem",
    title: "Problem Title",
    difficulty: "Medium",
    category: "Topic",
    description: {
      text: "Problem description...",
      notes: ["Note 1", "Note 2"],
    },
    examples: [
      {
        input: "input format",
        output: "expected output",
        explanation: "why this output",
      },
    ],
    constraints: ["constraint 1", "constraint 2"],
  },
};
```

### Deploying to Production

```bash
# Build frontend
cd frontend
npm run build

# Backend deployment (example: Heroku)
heroku login
heroku create app-name
git push heroku main

# Set environment variables on platform
heroku config:set MONGODB_URI=...
heroku config:set CLERK_SECRET_KEY=...
```

### Running Linter

```bash
# Frontend
cd frontend
npm run lint

# Fix automatically
npm run lint -- --fix
```

### Database Migration

```javascript
// Create migration file
// backend/migrations/migration_name.js

// Run migration
node backend/migrations/migration_name.js
```

---

## Performance Optimization

### Frontend Optimization

```javascript
// Code splitting
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// Memoization
const MemoizedComponent = memo(MyComponent);

// Lazy loading queries
const { data } = useQuery({
  queryKey: ["sessions"],
  queryFn: fetchSessions,
  staleTime: 1000 * 60 * 5,
});
```

### Backend Optimization

```javascript
// Database indexing
sessionSchema.index({ userId: 1, createdAt: -1 });

// Query optimization
const session = await Session.findById(id).select("code status");

// Caching
const cachedSessions = cache.get("user_sessions");
```

---

## Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Axios Documentation](https://axios-http.com)
- [React Query Documentation](https://tanstack.com/query)
