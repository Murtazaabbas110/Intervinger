# Intervinger - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Included with Node.js (verify with `npm -v`)
- **MongoDB**: Local installation OR MongoDB Atlas account ([Get Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### External Services (Required)

1. **Clerk Authentication** - https://clerk.com
2. **Stream.io** - https://getstream.io
3. **Inngest** - https://inngest.com (Optional for development)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Murtazaabbas110/Intervinger.git
cd Intervinger
```

---

## Step 2: Set Up External Services

### 2.1 Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign up or log in
3. Create a new application
4. Select your preferred authentication methods (Email, Social, etc.)
5. Note your credentials:
   - **Publishable Key** (Public Key)
   - **Secret Key** (Private Key)

### 2.2 Stream.io Setup

1. Go to [Stream Dashboard](https://dashboard.getstream.io)
2. Sign up or log in
3. Create a new application
4. Select your use case (Messaging, Video, etc.)
5. Note your credentials:
   - **API Key**
   - **API Secret**
6. Create a second application for Video
   - **Video API Key**
   - **Video API Secret**

### 2.3 MongoDB Setup (Choose One)

#### Option A: Local MongoDB

```bash
# Windows - Install MongoDB Community
# https://www.mongodb.com/try/download/community

# macOS - Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
mongod

# Connection string: mongodb://localhost:27017/intervinger
```

#### Option B: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster
4. Set up database user
5. Get connection string
6. Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/intervinger`

---

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd backend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Create Environment File

Create a `.env` file in the `backend` directory:

```env
# ============ SERVER CONFIGURATION ============
PORT=5000
NODE_ENV=development

# ============ DATABASE CONFIGURATION ============
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/intervinger

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intervinger

# ============ CLERK AUTHENTICATION ============
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# ============ STREAM.IO CONFIGURATION ============
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here
STREAM_VIDEO_API_KEY=your_stream_video_api_key_here
STREAM_VIDEO_API_SECRET=your_stream_video_api_secret_here

# ============ CLIENT CONFIGURATION ============
CLIENT_URL=http://localhost:5173

# ============ INNGEST CONFIGURATION (Optional) ============
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### 3.4 Verify Backend Setup

```bash
# Test if backend starts without errors
npm run dev
```

You should see:

```
Success running: 5000
```

**Leave this terminal running** or stop it with `Ctrl+C`

---

## Step 4: Frontend Setup

### 4.1 Navigate to Frontend Directory (New Terminal)

```bash
cd frontend
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Create Environment File

Create a `.env.local` file in the `frontend` directory:

```env
# ============ CLERK CONFIGURATION ============
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# ============ STREAM.IO CONFIGURATION ============
VITE_STREAM_API_KEY=your_stream_api_key_here
VITE_STREAM_VIDEO_API_KEY=your_stream_video_api_key_here

# ============ API CONFIGURATION ============
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4.4 Verify Frontend Setup

```bash
npm run dev
```

You should see:

```
  VITE v7.1.7  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

---

## Step 5: Test the Application

### 5.1 Open the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the Intervinger home page

### 5.2 Test Authentication Flow

1. Click "Sign Up" or "Get Started"
2. Complete Clerk authentication
3. Should redirect to Dashboard
4. Test creating a new session

### 5.3 Test API Connection

Open browser DevTools (F12) and check:

- Network requests complete successfully
- No CORS errors
- API returns data correctly

---

## Step 6: Verify All Components

### 6.1 Frontend Components

- [ ] Home page loads
- [ ] Authentication works
- [ ] Dashboard displays
- [ ] Problems page loads
- [ ] Create session modal works

### 6.2 Backend Features

- [ ] Chat token endpoint works (`GET /api/chat/token`)
- [ ] Session creation works (`POST /api/sessions`)
- [ ] Session retrieval works (`GET /api/sessions`)
- [ ] Health check works (`GET /health`)

### 6.3 External Services

- [ ] Clerk authentication connects
- [ ] Stream Chat initializes
- [ ] Stream Video initializes
- [ ] MongoDB connection works

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5000 already in use"

**Solution**:

```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# macOS/Linux - Find and kill
lsof -i :5000
kill -9 <PID>
```

### Issue: "CORS error" or "Cannot reach API"

**Solution**:

1. Verify backend is running (`npm run dev` in backend)
2. Check `CLIENT_URL` in `.env` matches frontend URL
3. Verify API endpoint in frontend matches backend URL
4. Check browser console for specific errors

### Issue: "Clerk authentication not working"

**Solution**:

1. Verify Clerk keys are correct (no typos)
2. Check Clerk application settings match your domain
3. Test Clerk keys with curl:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/health
```

### Issue: "Cannot connect to MongoDB"

**Solution**:

1. Verify MongoDB is running
2. Check connection string format
3. Verify database user credentials (if using Atlas)
4. Test connection:

```bash
# MongoDB URI should be accessible
# Use MongoDB Compass to test connection
```

### Issue: "Stream Chat/Video not connecting"

**Solution**:

1. Verify Stream API keys are correct
2. Check that chat token endpoint returns token
3. Verify user is authenticated before connecting
4. Check browser network tab for WebSocket errors

### Issue: npm install fails

**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Retry install
npm install
```

---

## Development Workflow

### Running Both Frontend and Backend

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Development Tools

#### Browser DevTools

- F12 or Right-click → Inspect
- Network tab for API debugging
- Console for JavaScript errors
- Application tab for authentication tokens

#### MongoDB Compass

```bash
# Download MongoDB Compass
# https://www.mongodb.com/products/compass

# Connect to your MongoDB instance
# View collections and data
```

#### Postman

```bash
# Download Postman
# https://www.postman.com/downloads/

# Import API requests
# Test endpoints with authentication
```

---

## Database Initialization

### Create Initial Collections

MongoDB collections are created automatically on first use. However, you may want to create indexes:

```javascript
// Connect to MongoDB and run:
db.sessions.createIndex({ interviewerId: 1 });
db.sessions.createIndex({ intervieweeId: 1 });
db.sessions.createIndex({ problemId: 1 });
db.sessions.createIndex({ status: 1 });
db.users.createIndex({ clerkId: 1 }, { unique: true });
```

---

## Production Deployment

### Frontend Deployment

```bash
# Build production files
cd frontend
npm run build

# Output: dist/ folder ready to deploy
# Deploy to: Vercel, Netlify, AWS S3, etc.
```

### Backend Deployment

1. Choose platform: Heroku, AWS, DigitalOcean, etc.
2. Set environment variables on platform
3. Deploy:

```bash
# Example for Heroku
heroku create intervinger-app
git push heroku main
```

### Environment Variables for Production

Update all `.env` variables for production:

- Change `NODE_ENV` to `production`
- Update URLs to production domains
- Use production Clerk/Stream keys
- Use MongoDB Atlas (not local)
- Enable HTTPS

---

## Performance Optimization

### Frontend Optimization

```bash
# Check bundle size
npm run build
ls -lh frontend/dist/

# Run linter
npm run lint
```

### Backend Optimization

- Enable compression middleware
- Set up caching headers
- Optimize database queries
- Monitor server logs

---

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled in production
- [ ] Clerk keys rotated periodically
- [ ] Stream API secret never exposed to frontend
- [ ] Database user has limited permissions
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Sensitive data not logged

---

## Monitoring & Debugging

### Enable Debug Logging

**Backend**:

```javascript
// Add to server.js
import debug from "debug";
const log = debug("intervinger:*");
```

**Frontend**:

```javascript
// Browser console
localStorage.debug = "*";
```

### Common Logs to Monitor

- API request/response times
- Database query performance
- WebSocket connection status
- Authentication failures
- Stream service errors

---

## Next Steps

1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoints
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Review [README.md](./README.md) for feature overview
4. Set up CI/CD pipeline for automated deployment
5. Configure monitoring and error tracking

---

## Support Resources

- **Clerk Docs**: https://clerk.com/docs
- **Stream.io Docs**: https://getstream.io/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **Project Issues**: https://github.com/Murtazaabbas110/Intervinger/issues

---

## Quick Reference Commands

```bash
# Start development servers
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Build for production
cd frontend && npm run build
cd backend && npm run start

# Run linter
cd frontend && npm run lint

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if ports are available
# Windows
netstat -ano | findstr :5000 :5173

# macOS/Linux
lsof -i :5000 && lsof -i :5173

# Test API endpoint
curl http://localhost:5000/health

# MongoDB operations
# (Using MongoDB Compass or mongo shell)
use intervinger
db.sessions.find()
```

---

## Checklists

### Initial Setup Checklist

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] Clerk account created and keys obtained
- [ ] Stream.io account created and keys obtained
- [ ] MongoDB set up (local or Atlas)
- [ ] Backend `.env` file created
- [ ] Frontend `.env.local` file created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Application loads in browser
- [ ] Authentication works
- [ ] API requests succeed

### Before Committing Code

- [ ] No environment variables in code
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Linter passes (`npm run lint`)
- [ ] No console errors or warnings
- [ ] All features tested locally
- [ ] Code follows project conventions

### Before Deployment

- [ ] All tests passing
- [ ] Production environment variables set
- [ ] Build successful (`npm run build`)
- [ ] No security issues
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Performance optimized
