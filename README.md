# Intervinger - Collaborative Coding Interview Platform

A full-stack web application that enables real-time collaborative coding interviews with video calls, live chat, and code execution capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)

## 🎯 Overview

Intervinger is a platform designed to facilitate technical interviews and collaborative coding sessions. It provides interviewers and interviewees with a seamless experience for solving coding problems together in real-time, complete with video conferencing, instant messaging, and a live code editor.

## ✨ Features

- **Real-time Chat**: Instant messaging between participants using Stream Chat
- **Video Conferencing**: Peer-to-peer video calls with Stream Video SDK
- **Live Code Editor**: Monaco Editor integration for collaborative code writing
- **Session Management**: Create, manage, and track interview sessions
- **Problem Library**: Pre-configured coding problems with multiple difficulty levels
- **Code Execution**: Execute and test code solutions using Piston API
- **Authentication**: Secure user authentication with Clerk
- **Dashboard**: View active sessions, recent sessions, and statistics
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS

## 🛠 Tech Stack

### Frontend

- **Framework**: React 19 with Vite
- **Authentication**: Clerk
- **Code Editor**: Monaco Editor
- **Real-time Communication**: Stream Chat & Stream Video SDK
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS + DaisyUI
- **HTTP Client**: Axios
- **Additional**: React Router for navigation, react-hot-toast for notifications

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk Express Middleware
- **Real-time Services**: Stream Chat SDK
- **Workflow Orchestration**: Inngest
- **Development**: Nodemon for hot reload

## 📁 Project Structure

```
intervinger/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API setup
│   │   ├── api/             # API integration functions
│   │   ├── data/            # Static data (problems, etc.)
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express server
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API route definitions
│   │   ├── models/           # MongoDB schemas
│   │   ├── middleware/       # Custom middleware
│   │   ├── lib/              # Utility modules
│   │   └── server.js         # Application entry point
│   ├── package.json
│   └── .env                  # Environment variables
│
└── package.json              # Root package file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Clerk account (https://clerk.com)
- Stream.io account (https://getstream.io)
- Git

### Environment Setup

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/intervinger
# or use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intervinger

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Stream.io Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
STREAM_VIDEO_API_KEY=your_stream_video_api_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Inngest Configuration
INNGEST_EVENT_KEY=your_inngest_key
```

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_STREAM_VIDEO_API_KEY=your_stream_video_api_key
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Application runs on `http://localhost:5173`

### Production Build

```bash
npm run build
npm start
```

The frontend build is served from the backend at `/` route.

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Chat Endpoints

#### Get Stream Chat Token

- **Endpoint**: `GET /api/chat/token`
- **Authentication**: Required (Clerk)
- **Response**:

```json
{
  "token": "stream_chat_token",
  "userId": "user_id"
}
```

### Session Endpoints

#### Create Session

- **Endpoint**: `POST /api/sessions`
- **Body**:

```json
{
  "problemId": "two-sum",
  "participantId": "interviewee_id"
}
```

#### Get Session

- **Endpoint**: `GET /api/sessions/:id`

#### Update Session

- **Endpoint**: `PUT /api/sessions/:id`
- **Body**:

```json
{
  "status": "active|completed",
  "code": "user_code",
  "output": "code_output"
}
```

#### List User Sessions

- **Endpoint**: `GET /api/sessions`

## 🏗 Architecture

### Authentication Flow

1. User signs up/logs in via Clerk
2. Clerk provides JWT token
3. Backend validates token via Clerk middleware
4. User is granted access to protected routes

### Real-time Communication

1. **Chat**: Users connect to Stream Chat channels
2. **Video**: Users establish WebRTC connections via Stream Video SDK
3. **Code Execution**: Code is sent to Piston API for execution

### Session Lifecycle

1. Interviewer creates a session with problem
2. Interviewee joins the session
3. Real-time updates via WebSockets (Stream services)
4. Session completion recorded in MongoDB
5. Session history available in dashboard

### Data Models

#### User

- Managed by Clerk
- Extended data stored in Session documents

#### Session

```javascript
{
  _id: ObjectId,
  interviewerId: String,
  intervieweeId: String,
  problemId: String,
  code: String,
  output: String,
  status: "active|completed",
  streamChannelId: String,
  createdAt: Date,
  completedAt: Date
}
```

#### Problem

- Pre-configured static data in frontend
- Contains title, description, examples, constraints
- Includes test cases for validation

## 📖 Key Components

### Frontend Components

- **Dashboard**: Main user dashboard with session overview
- **SessionPage**: Active session with code editor and chat
- **ProblemPage**: Problem details and interactive solving
- **VideoCallUI**: Video conference interface
- **CodeEditorPanel**: Monaco Editor wrapper
- **OutputPanel**: Code execution results display
- **Navbar**: Navigation and user menu

### Backend Controllers

- **ChatController**: Handles Stream token generation
- **SessionController**: CRUD operations for sessions
- **AuthMiddleware**: Protects routes with Clerk authentication

## 🔧 Development Workflow

1. Create a feature branch
2. Make changes in frontend or backend
3. Test locally
4. Commit and push
5. Create pull request
6. Deploy after review

## 📝 Environment Variables Reference

### Backend (.env)

| Variable          | Description           | Example                               |
| ----------------- | --------------------- | ------------------------------------- |
| PORT              | Server port           | 5000                                  |
| NODE_ENV          | Environment           | development/production                |
| MONGODB_URI       | Database connection   | mongodb://localhost:27017/intervinger |
| CLERK_SECRET_KEY  | Clerk secret          | sk*test*...                           |
| STREAM_API_KEY    | Stream.io API key     | your_stream_key                       |
| STREAM_API_SECRET | Stream.io secret      | your_stream_secret                    |
| CLIENT_URL        | Frontend URL for CORS | http://localhost:5173                 |

### Frontend (.env.local)

| Variable                   | Description       | Example                   |
| -------------------------- | ----------------- | ------------------------- |
| VITE_CLERK_PUBLISHABLE_KEY | Clerk public key  | pk*test*...               |
| VITE_STREAM_API_KEY        | Stream.io API key | your_stream_key           |
| VITE_API_BASE_URL          | Backend API base  | http://localhost:5000/api |

## 🐛 Troubleshooting

### Chat Connection Issues

- Verify Stream API keys are correct
- Check that user is authenticated with Clerk
- Ensure CORS is properly configured

### Video Call Issues

- Confirm Stream Video API key is valid
- Check browser permissions for camera/microphone
- Verify WebRTC connection in browser network settings

### Database Connection Issues

- Verify MongoDB is running
- Check connection string format
- Ensure database user has proper permissions

## 📦 Dependencies Overview

### Critical Frontend Libraries

- `@clerk/clerk-react`: Authentication
- `@monaco-editor/react`: Code editor
- `@stream-io/video-react-sdk`: Video conferencing
- `stream-chat-react`: Real-time messaging
- `react-router`: Client-side routing

### Critical Backend Libraries

- `@clerk/express`: Authentication middleware
- `@stream-io/node-sdk`: Stream services
- `mongoose`: MongoDB ODM
- `inngest`: Workflow orchestration

## 🚢 Deployment

### Frontend Deployment

- Build: `npm run build --prefix frontend`
- Deploy `frontend/dist` to CDN or hosting provider
- Set environment variables in hosting platform

### Backend Deployment

- Deploy Node.js application to platform (Heroku, AWS, etc.)
- Set all environment variables
- Ensure MongoDB instance is accessible
- Configure CORS for frontend domain

## 📄 License

ISC License - See repository for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Create Pull Request

## 📧 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review API documentation

---

**Repository**: https://github.com/Murtazaabbas110/Intervinger
