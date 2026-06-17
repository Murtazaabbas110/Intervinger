# Intervinger - Architecture Documentation

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                    React + Vite Application                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼──────┐ ┌──▼─────────┐ ┌▼──────────────┐
            │  HTTP/REST   │ │  WebSocket │ │  WebSocket    │
            │   Requests   │ │ (Chat)     │ │  (Video)      │
            └───────┬──────┘ └──┬─────────┘ └┬──────────────┘
                    │           │           │
            ┌───────┴───────────┴───────────┴─────────┐
            │                                         │
      ┌─────▼─────────────────────────────────────┐   │
      │   EXPRESS.JS SERVER                       │   │
      │   (Backend API)                           │   │
      │                                           │   │
      │  ┌─────────────────────────────────────┐  │   │
      │  │ Routes                              │  │   │
      │  │ - /api/chat                         │  │   │
      │  │ - /api/sessions                     │  │   │
      │  │ - /api/inngest (Workflows)          │  │   │
      │  └─────────────────────────────────────┘  │   │
      │                                           │   │
      │  ┌─────────────────────────────────────┐  │   │
      │  │ Middleware                          │  │   │
      │  │ - Clerk Authentication              │  │   │
      │  │ - CORS                              │  │   │
      │  │ - Route Protection                  │  │   │
      │  └─────────────────────────────────────┘  │   │
      └─────┬─────────────────────────────────────┘   │
            │                                         │
    ┌───────┴──────────────┬──────────────┬───────────┘
    │                      │              │
    │                      │              │
┌───▼────────┐    ┌────────▼─────┐  ┌─────▼────────────┐
│  MongoDB   │    │  Stream.io   │  │  Inngest         │
│  Database  │    │  Services    │  │  Orchestration   │
│            │    │              │  │                  │
│ - Sessions │    │ - Chat SDK   │  │ - Workflows      │
│ - Users    │    │ - Video SDK  │  │ - Event Handling │
└────────────┘    └──────────────┘  └──────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Root)
├── HomePage (Unauthenticated)
├── DashboardPage
│   ├── Navbar
│   ├── StatsCards
│   ├── ActiveSessions
│   ├── RecentSessions
│   └── WelcomeSection
├── ProblemsPage
│   ├── Navbar
│   └── Problem List
├── ProblemPage
│   ├── Navbar
│   ├── ProblemDescription
│   ├── CreateSessionModal
│   └── CodeEditorPanel
├── SessionPage
│   ├── Navbar
│   ├── CodeEditorPanel
│   ├── OutputPanel
│   ├── VideoCallUI
│   └── Chat (Stream Chat)
└── Navigation & Routing
```

### Data Flow

```
User Action
    │
    ├─→ React Component
    │
    ├─→ Hook (useSessions, useStreamClient)
    │
    ├─→ API Call (axios)
    │
    ├─→ Backend Express Route
    │
    ├─→ Controller Logic
    │
    ├─→ Database/Service Interaction
    │
    └─→ Response Back to Frontend
        │
        ├─→ React Query (Caching)
        │
        └─→ State Update & Re-render
```

### State Management Strategy

- **Authentication**: Clerk (external)
- **Real-time Data**: Stream Chat & Video SDKs (WebSocket)
- **Server State**: React Query (@tanstack/react-query)
- **Local UI State**: React useState hooks

### API Integration

```javascript
// Axios Instance Setup (lib/axios.js)
├── Base URL Configuration
├── Interceptors
│   ├── Request: Add auth tokens
│   └── Response: Handle errors
└── Error Handling

// API Methods (api/sessions.js)
├── fetchSessions()
├── createSession()
├── updateSession()
└── executeCode()
```

## Backend Architecture

### Server Structure

```
Express App
├── Middleware Stack
│   ├── Express JSON Parser
│   ├── CORS Configuration
│   ├── Clerk Authentication
│   └── Custom Middleware
├── Route Handlers
│   ├── Chat Routes (/api/chat)
│   │   └── GET /token
│   ├── Session Routes (/api/sessions)
│   │   ├── POST / (create)
│   │   ├── GET / (list)
│   │   ├── GET /:id (read)
│   │   └── PUT /:id (update)
│   └── Inngest Routes (/api/inngest)
└── Production Setup
    └── Static File Serving (React build)
```

### Controller Logic

#### ChatController

```
getStreamToken(req, res)
├── Verify user authentication (Clerk)
├── Generate Stream token
└── Return token to client
```

#### SessionController

```
createSession(req, res)
├── Validate request data
├── Create MongoDB document
├── Initialize Stream channel
└── Return session details

getSession(req, res)
├── Retrieve from MongoDB
├── Validate user authorization
└── Return session data

updateSession(req, res)
├── Update session record
├── Sync with Stream channel
├── Log changes
└── Return updated session

listSessions(req, res)
├── Query user's sessions
├── Apply filters/sorting
└── Return paginated results
```

### Database Schema

#### Session Model

```javascript
{
  _id: ObjectId,
  interviewerId: String (Clerk ID),
  intervieweeId: String (Clerk ID),
  problemId: String (reference to problem),
  code: String (submitted code),
  output: String (execution result),
  language: String (programming language),
  status: Enum ["active", "completed", "paused"],
  streamChannelId: String (Stream Chat channel),
  notes: String,
  createdAt: Date,
  completedAt: Date,
  updatedAt: Date
}
```

#### User Model

```javascript
{
  _id: ObjectId,
  clerkId: String (unique),
  email: String,
  name: String,
  avatar: String,
  sessionsCompleted: Number,
  totalCodingTime: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

### Clerk Integration

```
1. User Opens App
   ↓
2. Check Clerk Session (Frontend)
   ├─ Not Authenticated → Show HomePage
   └─ Authenticated → Show Protected Routes
   ↓
3. API Request to Backend
   ├─ Frontend sends JWT token in headers
   ├─ Backend validates with Clerk middleware
   └─ Proceed or reject request
   ↓
4. Protected Routes
   ├─ Dashboard (requires auth)
   ├─ Problems (requires auth)
   └─ Sessions (requires auth)
```

### Protection Middleware

```javascript
// Backend middleware/protectRoute.js
middleware: protectRoute
├── Check Clerk session
├── Verify user identity
├── Add user info to request
└── Proceed to controller or reject
```

## Real-Time Communication

### Chat System (Stream.io)

```
User Connects to Session
├─ Get Stream token from backend
├─ Connect to Stream client
├─ Join chat channel
├─ Subscribe to message updates
└─ Send/receive messages in real-time
```

### Video System (Stream Video SDK)

```
Video Call Initiation
├─ Initiator creates call
├─ Sends call ID to other participant
├─ Both connect to Stream Video
├─ Establish peer connection
└─ Stream audio/video
```

## Code Execution Pipeline

```
User Submits Code
    ↓
Frontend: Send code to backend
    ↓
Backend: Validate code
    ↓
Call Piston API (code execution service)
    ↓
Return execution result
    ↓
Frontend: Display output to user
    ↓
Store result in database
```

## Workflow Orchestration (Inngest)

### Event-Driven Architecture

```
Event Triggers
├─ Session Created
├─ Session Completed
├─ Code Executed
└─ User Milestone Reached
    ↓
Inngest Processes Event
    ├─ Validation
    ├─ Data transformation
    ├─ Side effects (notifications, logs)
    └─ Database updates
```

## Security Architecture

### Layers

```
1. Frontend Security
   ├─ Clerk authentication
   ├─ Protected routes
   └─ Secure token storage

2. Transport Security
   ├─ HTTPS (in production)
   ├─ CORS validation
   └─ Secure WebSockets (WSS)

3. Backend Security
   ├─ Route authentication (Clerk middleware)
   ├─ Request validation
   ├─ Input sanitization
   └─ Authorization checks

4. Database Security
   ├─ MongoDB user permissions
   ├─ Connection encryption
   └─ Data encryption at rest
```

## Deployment Architecture

### Development Environment

```
localhost:5173 (Frontend)
    ↔ API calls
localhost:5000 (Backend)
    ↔ Database queries
MongoDB (local or Atlas)
```

### Production Environment

```
CDN / Hosting
├─ Serves React build
└─ Redirects API to backend

Backend Server
├─ Serves API endpoints
├─ Static fallback for SPA
└─ Connects to:
    ├─ MongoDB (Atlas)
    ├─ Clerk (SaaS)
    ├─ Stream.io (SaaS)
    └─ Inngest (SaaS)
```

## Performance Considerations

### Frontend Optimization

- Code splitting via Vite
- React Query caching
- Lazy loading components
- Image optimization
- CSS-in-JS vs Tailwind

### Backend Optimization

- Database indexing on frequently queried fields
- Connection pooling (MongoDB)
- Request validation early
- Error handling efficiency

### Network Optimization

- Minimize bundle size
- Compression (gzip)
- CDN for static assets
- API response caching

## Scalability Considerations

### Database Scaling

- MongoDB Atlas auto-scaling
- Indexing strategy for queries
- Connection pooling

### Server Scaling

- Horizontal scaling (multiple instances)
- Load balancing
- Stateless architecture (important for WebSocket)

### Real-time Scaling

- Stream.io handles scaling
- WebSocket connection pooling
- Message queue for high volume

## Monitoring & Observability

### Logging

- Backend logs (server console)
- Frontend error tracking
- Database query logs

### Metrics

- Response times
- Error rates
- Active sessions count
- User engagement

### Debugging

- Browser DevTools
- Network tab analysis
- MongoDB Compass for data inspection
- Server logs monitoring

## Technology Justification

| Technology | Purpose            | Alternative         | Reason Chosen                     |
| ---------- | ------------------ | ------------------- | --------------------------------- |
| React      | Frontend framework | Vue, Svelte         | Ecosystem, community support      |
| Vite       | Build tool         | Webpack             | Fast HMR, quick builds            |
| Express    | Backend framework  | FastAPI, Django     | Node.js ecosystem, simplicity     |
| MongoDB    | Database           | PostgreSQL          | Flexible schema, document storage |
| Clerk      | Authentication     | Auth0               | Developer experience, modern      |
| Stream.io  | Real-time comms    | Socket.io, Firebase | Specialized, feature-rich         |
| Inngest    | Workflow engine    | Bull, Delayed       | Serverless-first approach         |

## Future Architecture Improvements

1. **Microservices**: Separate code execution, chat, video services
2. **Caching Layer**: Redis for session data caching
3. **Queue System**: Message queue for heavy operations
4. **Analytics**: Event tracking and user behavior analysis
5. **CDN Integration**: Distribute static assets globally
6. **API Gateway**: Single entry point for all services
7. **GraphQL**: Consider GraphQL for complex data queries
