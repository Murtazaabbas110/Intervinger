# Intervinger - Troubleshooting Guide

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Database Issues](#database-issues)
4. [Authentication Issues](#authentication-issues)
5. [API Issues](#api-issues)
6. [Real-time Features Issues](#real-time-features-issues)
7. [Performance Issues](#performance-issues)
8. [Browser Issues](#browser-issues)
9. [Deployment Issues](#deployment-issues)

---

## Installation Issues

### Problem: "npm install fails with error"

**Symptoms**:

```
npm ERR! code E404
npm ERR! 404 Not Found
```

**Solutions**:

1. Clear npm cache:

```bash
npm cache clean --force
```

2. Delete node_modules and lock file:

```bash
rm -rf node_modules package-lock.json
npm install
```

3. Update npm:

```bash
npm install -g npm@latest
```

4. Try installing specific package:

```bash
npm install package-name@version
```

5. Check Node version:

```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

---

### Problem: "Module not found" error

**Symptoms**:

```
Cannot find module '@clerk/clerk-react'
Error: Cannot find module 'express'
```

**Solutions**:

1. Verify package.json exists in directory
2. Install dependencies:

```bash
npm install
```

3. Check correct directory:

```bash
cd frontend  # for frontend dependencies
cd backend   # for backend dependencies
```

4. Reinstall specific package:

```bash
npm install @clerk/clerk-react@latest
```

5. Check package name spelling in package.json

---

### Problem: "Version conflict" or "peer dependency warning"

**Symptoms**:

```
npm WARN @clerk/clerk-react@5.55.0 requires react@^19.0.0
```

**Solutions**:

1. These warnings are often non-blocking
2. If blocking, force specific versions:

```bash
npm install --force
npm install --legacy-peer-deps
```

3. Or update packages to compatible versions:

```bash
npm update
```

---

## Development Server Issues

### Problem: "Port already in use"

**Symptoms**:

```
Error: listen EADDRINUSE :::5000
Error: Port 5173 is in use
```

**Solutions**:

**Windows**:

```bash
# Find process using port
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F

# Or change port in backend
# Edit .env: PORT=5001
```

**macOS/Linux**:

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use
fuser -k 5000/tcp
```

---

### Problem: "Frontend not connecting to backend"

**Symptoms**:

```
Failed to fetch from http://localhost:5000/api/sessions
CORS error in console
```

**Solutions**:

1. Verify backend is running:

```bash
cd backend && npm run dev
# Should show "Success running: 5000"
```

2. Check CORS configuration in `.env`:

```env
CLIENT_URL=http://localhost:5173
```

3. Verify API base URL in frontend `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Check firewall settings
5. Test with curl:

```bash
curl http://localhost:5000/health
# Should return: {"msg":"success from API"}
```

6. Check browser console (F12) for exact error message

---

### Problem: "Hot reload not working"

**Symptoms**:

- Changes don't appear when file is saved
- Have to manually refresh browser
- Backend changes require server restart

**Solutions**:

**Frontend**:

```bash
# Restart dev server
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Backend**:

```bash
# Verify nodemon is installed
npm list nodemon

# Restart dev server
npm run dev

# Check if files are being watched
# Should show "watching" in terminal
```

---

## Database Issues

### Problem: "Cannot connect to MongoDB"

**Symptoms**:

```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongooseError: Cannot connect to MongoDB
```

**Solutions**:

**For Local MongoDB**:

1. Verify MongoDB is installed:

```bash
mongod --version
```

2. Start MongoDB service:

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

3. Verify it's running:

```bash
mongo  # or mongosh
# Should show MongoDB shell
```

4. Check connection string in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/intervinger
```

**For MongoDB Atlas**:

1. Verify connection string format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intervinger
```

2. Check credentials:
   - Username matches database user
   - Password is URL encoded
   - Correct cluster name

3. Verify IP whitelist:
   - Go to MongoDB Atlas dashboard
   - Network Access → IP Whitelist
   - Add your IP or 0.0.0.0/0 (for development)

4. Test connection:

```bash
# Using MongoDB Compass
# Or using mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/intervinger"
```

---

### Problem: "Database operation timeout"

**Symptoms**:

```
MongooseError: Operation timeout
MongoDB timeout exceeded
```

**Solutions**:

1. Check database connection:

```bash
# Test connection speed
time curl -I https://cloud.mongodb.com
```

2. Increase timeout in connection string:

```env
MONGODB_URI=mongodb://localhost:27017/intervinger?serverSelectionTimeoutMS=5000
```

3. Check network connectivity
4. Verify database is not overloaded
5. Check database user permissions

---

### Problem: "Collection or index errors"

**Symptoms**:

```
Error: Field 'email' is not indexed
E11000 duplicate key error
```

**Solutions**:

1. Create required indexes:

```bash
# Connect to MongoDB
mongo intervinger

# Create indexes
db.sessions.createIndex({ interviewerId: 1 })
db.sessions.createIndex({ intervieweeId: 1 })
db.users.createIndex({ clerkId: 1 }, { unique: true })
```

2. Drop and recreate collection:

```bash
db.sessions.drop()
db.sessions.createIndex({ interviewerId: 1, createdAt: -1 })
```

---

## Authentication Issues

### Problem: "Clerk authentication not working"

**Symptoms**:

```
Clerk is not initialized
useUser() returns undefined
Cannot sign in
```

**Solutions**:

1. Verify Clerk keys in `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

2. Verify Clerk frontend initialization:

```javascript
// frontend/src/main.jsx
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>,
);
```

3. Check Clerk dashboard:
   - Verify application exists
   - Check API keys match `.env.local`
   - Verify allowed origin includes localhost:5173

4. Clear browser cache:

```bash
# In browser DevTools: Application → Clear storage
# Or Ctrl+Shift+Delete
```

5. Hard refresh browser:

```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

---

### Problem: "Backend authentication failing"

**Symptoms**:

```
401 Unauthorized error
Token validation failed
Cannot access protected routes
```

**Solutions**:

1. Verify Clerk backend keys in `.env`:

```env
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

2. Verify Clerk middleware is set up:

```javascript
// backend/src/server.js
import { clerkMiddleware } from "@clerk/express";
app.use(clerkMiddleware());
```

3. Check token is being sent:

```javascript
// Check in browser DevTools → Network tab
// Request headers should have:
// Authorization: Bearer eyJhbGc...
```

4. Verify token format:

```bash
# Token should start with "eyJ"
# Not "pk_" or "sk_"
```

5. Test auth endpoint:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/chat/token
```

---

## API Issues

### Problem: "API returns 404 Not Found"

**Symptoms**:

```
404: Cannot POST /api/sessions
Cannot GET /api/chat/token
```

**Solutions**:

1. Verify route is registered in `server.js`:

```javascript
import sessionRoutes from "./routes/sessionRoutes.js";
app.use("/api/sessions", sessionRoutes);
```

2. Check route file exists:

```bash
ls backend/src/routes/sessionRoutes.js
```

3. Verify HTTP method (GET/POST/PUT):

```javascript
// Should match request
router.get("/sessions"); // GET /api/sessions
router.post("/sessions"); // POST /api/sessions
```

4. Check URL spelling:
   - Typos in endpoint name
   - Missing trailing slash (if required)
   - Case sensitivity

---

### Problem: "API returns 500 Internal Server Error"

**Symptoms**:

```
500: Internal Server Error
Error from API server
```

**Solutions**:

1. Check backend console for error:

```
Look at terminal running "npm run dev"
Error message will be printed there
```

2. Common causes:
   - Database connection failed
   - Missing environment variable
   - Unhandled exception
   - External service error

3. Example debugging:

```javascript
// Add try-catch and logging
try {
  const session = await Session.findById(id);
  res.json(session);
} catch (error) {
  console.error("Error in getSession:", error);
  res.status(500).json({ error: error.message });
}
```

4. Check backend `.env`:

```bash
# All required variables set?
cat .env | grep -i mongodb
cat .env | grep -i clerk
cat .env | grep -i stream
```

---

### Problem: "API request timeout"

**Symptoms**:

```
Request timeout after 30s
ERR_CONNECTION_TIMEOUT
```

**Solutions**:

1. Check if backend is running:

```bash
curl http://localhost:5000/health
```

2. Increase timeout in axios:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 60000, // 60 seconds
});
```

3. Check long-running operations:
   - Database queries taking too long
   - External API calls timing out
   - Code execution taking too long

4. Optimize database queries:
   - Add indexes
   - Limit fields returned
   - Use pagination

---

## Real-time Features Issues

### Problem: "Chat not connecting"

**Symptoms**:

```
Stream Chat client not initialized
Cannot send/receive messages
WebSocket connection failed
```

**Solutions**:

1. Verify Stream API key in `.env.local`:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

2. Get chat token from backend:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/chat/token
```

3. Check token response:
   - Should include `token`, `userId`, `apiKey`
   - Token should not be empty

4. Verify Stream client initialization:

```javascript
import { StreamChat } from "stream-chat";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const client = StreamChat.getInstance(apiKey);
await client.connectUser({ id: userId }, token);
```

5. Check browser console for errors:
   - F12 → Console tab
   - Look for Stream.io specific errors

---

### Problem: "Video call not working"

**Symptoms**:

```
Cannot join video call
Camera/microphone not working
No video stream visible
```

**Solutions**:

1. Check browser permissions:
   - Site Settings → Camera → Allow
   - Site Settings → Microphone → Allow
   - Reload page after changing permissions

2. Verify Stream Video API key:

```env
VITE_STREAM_VIDEO_API_KEY=your_stream_video_api_key
```

3. Test camera/microphone:

```bash
# Open: https://test.webrtc.org/
# Test if devices are working
```

4. Check device selection:
   - Select correct camera
   - Select correct microphone
   - Test audio levels

5. Network issues:
   - Close other apps using bandwidth
   - Try different network
   - Check if ISP is blocking WebRTC

---

### Problem: "WebSocket connection refused"

**Symptoms**:

```
WebSocket connection failed
Cannot establish WSS connection
Real-time updates not working
```

**Solutions**:

1. Check firewall:
   - WebSocket port open (usually 443 for WSS)
   - Corporate firewall may block WebSocket

2. Test WebSocket connection:

```javascript
const ws = new WebSocket("wss://example.com/stream");
ws.addEventListener("open", () => console.log("Connected"));
ws.addEventListener("error", (e) => console.error("Error:", e));
```

3. Verify Stream.io configuration
4. Check browser DevTools:
   - Network tab → WS (WebSocket)
   - Look for connection status

---

## Performance Issues

### Problem: "Slow page load"

**Symptoms**:

- Takes >3 seconds to load
- Large bundle size
- Slow API responses

**Solutions**:

1. Check bundle size:

```bash
cd frontend
npm run build
# Check dist/ folder size
```

2. Analyze bundle:

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Build and open report
npm run build
```

3. Optimize images:
   - Use appropriate format (JPEG, WebP)
   - Compress images
   - Lazy load images

4. Code splitting:

```javascript
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

5. Check API response time:

```bash
# Time a request
time curl http://localhost:5000/api/sessions
```

---

### Problem: "High memory usage"

**Symptoms**:

- Application becomes sluggish
- Browser tab crashes
- "Out of memory" errors

**Solutions**:

1. Check for memory leaks:
   - F12 → Performance tab
   - Record and check memory growth
   - Take heap snapshots

2. Common causes:
   - Large datasets not paginated
   - Event listeners not cleaned up
   - Cached data growing unbounded

3. Fix example:

```javascript
// Clean up on unmount
useEffect(() => {
  return () => {
    subscription?.unsubscribe();
    eventListener?.remove();
  };
}, []);
```

---

### Problem: "Slow database queries"

**Symptoms**:

- API requests slow
- Database operations timeout
- Loading spinners stuck

**Solutions**:

1. Add database indexes:

```javascript
db.sessions.createIndex({ interviewerId: 1, createdAt: -1 });
db.sessions.createIndex({ status: 1 });
```

2. Analyze slow queries:

```bash
# Enable slow query logging
# Check MongoDB logs
```

3. Optimize queries:

```javascript
// Before - finds all fields
const sessions = await Session.find();

// After - finds only needed fields
const sessions = await Session.find().select("id title status");
```

4. Add pagination:

```javascript
const limit = 10;
const skip = (page - 1) * limit;
const sessions = await Session.find().skip(skip).limit(limit);
```

---

## Browser Issues

### Problem: "Console shows CORS errors"

**Symptoms**:

```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

**Solutions**:

1. Verify CORS is configured in backend:

```javascript
import cors from "cors";
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);
```

2. Check `CLIENT_URL` in backend `.env`:

```env
CLIENT_URL=http://localhost:5173
```

3. Verify frontend URL matches
4. Make sure CORS middleware is before routes:

```javascript
app.use(cors(...));  // Before routes
app.use('/api', routes);
```

---

### Problem: "Blank page or white screen"

**Symptoms**:

- Nothing loads
- Page is empty
- No error messages

**Solutions**:

1. Check browser console (F12):
   - JavaScript errors
   - Failed API calls
   - Missing resources

2. Check Network tab:
   - index.html loaded?
   - main.js loaded?
   - 404 errors?

3. Verify React is mounted:

```javascript
// Check if root div exists
document.getElementById("root");
```

4. Check App component:

```javascript
// Might be rendering null in some cases
if (!isLoaded) return null; // Remove or add fallback
```

5. Hard refresh:

```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

---

### Problem: "Styles not loading"

**Symptoms**:

- No styling applied
- UI looks broken
- Missing colors/fonts

**Solutions**:

1. Check CSS files are bundled:

```bash
# Check dist/assets/ contains CSS files
ls frontend/dist/assets/
```

2. Verify Tailwind is configured:

```javascript
// tailwind.config.js should exist
// vite.config.js should include Tailwind plugin
```

3. Hard refresh browser:

```
Ctrl+Shift+R
```

4. Clear browser cache:
   - DevTools → Application → Storage → Clear all

---

## Deployment Issues

### Problem: "Build fails"

**Symptoms**:

```
npm run build fails
Build error during deployment
```

**Solutions**:

1. Run build locally first:

```bash
cd frontend
npm run build
# Check error message
```

2. Common issues:

```javascript
// TypeScript errors
// Unused variables
// Missing imports
```

3. Fix errors and retry:

```bash
npm run lint -- --fix
npm run build
```

---

### Problem: "Application crashes after deployment"

**Symptoms**:

- Works locally, fails in production
- 500 errors on deployment
- Environment variables not set

**Solutions**:

1. Check environment variables on server:

```bash
# On your hosting platform, verify:
# MONGODB_URI
# CLERK_SECRET_KEY
# STREAM_API_KEY
# etc.
```

2. Check logs on hosting platform
3. Verify database accessibility from server
4. Test API endpoints:

```bash
curl https://your-domain.com/api/health
```

---

### Problem: "Frontend shows "Cannot GET /" in production"

**Symptoms**:

- 404 error
- API works but frontend doesn't load
- SPA routing broken

**Solutions**:

1. Verify fallback route in `server.js`:

```javascript
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
```

2. Verify frontend is built:

```bash
cd frontend
npm run build
# Check dist/ folder exists and is not empty
```

3. Verify correct path to built files
4. Check file permissions on server

---

## Getting Additional Help

### Resources

- **Documentation**: Check README.md, SETUP_GUIDE.md
- **GitHub Issues**: https://github.com/Murtazaabbas110/Intervinger/issues
- **Stack Overflow**: Tag with project name
- **Community**: Check discussions

### When Reporting Issues

Include:

- Error message (full text)
- Steps to reproduce
- Operating system
- Node.js version
- Screenshots if applicable
- Relevant error logs

---

## Quick Reference

### Check Server Status

```bash
curl http://localhost:5000/health
```

### Check Database Connection

```bash
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/intervinger"
```

### Clear Cache

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Restart Services

```bash
# Kill processes on ports
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>

# Restart servers
npm run dev
```

### View Logs

```bash
# Backend logs: Check terminal running npm run dev
# Frontend logs: DevTools Console (F12)
# Database logs: Check MongoDB logs folder
```
