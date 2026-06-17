# Intervinger - API Documentation

## Overview

The Intervinger API provides RESTful endpoints for session management, real-time chat integration, and interview operations. All endpoints require authentication via Clerk.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All API requests require a valid Clerk JWT token. Include it in the request header:

```
Authorization: Bearer <clerk_jwt_token>
```

The token is automatically included by the frontend Axios instance.

## Response Format

All responses follow a consistent JSON format:

### Success Response

```json
{
  "success": true,
  "data": {
    /* endpoint-specific data */
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error code",
  "message": "Human-readable error message",
  "statusCode": 400
}
```

## Chat Endpoints

### 1. Get Stream Chat Token

Retrieves a token for connecting to Stream Chat service.

**Endpoint**: `GET /api/chat/token`

**Authentication**: Required

**Request Headers**:

```
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
```

**Response**:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "user_clerk_id",
    "apiKey": "stream_api_key",
    "expiresAt": "2024-05-15T10:30:00Z"
  }
}
```

**Status Codes**:

- `200`: Token successfully generated
- `401`: Unauthorized - Invalid or missing token
- `500`: Server error

**Example**:

```javascript
// Frontend
const response = await axios.get("/chat/token");
const { token, userId, apiKey } = response.data.data;

// Connect to Stream Chat
const client = StreamChat.getInstance(apiKey);
await client.connectUser(
  {
    id: userId,
    name: user.fullName,
  },
  token,
);
```

---

## Session Endpoints

### 1. Create Session

Creates a new interview session between interviewer and interviewee.

**Endpoint**: `POST /api/sessions`

**Authentication**: Required

**Request Headers**:

```
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "problemId": "two-sum",
  "intervieweeId": "interviewee_clerk_id",
  "language": "javascript",
  "notes": "Optional session notes"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| problemId | String | Yes | ID of the coding problem |
| intervieweeId | String | Yes | Clerk ID of the interviewee |
| language | String | No | Programming language (default: javascript) |
| notes | String | No | Initial session notes |

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "interviewerId": "interviewer_clerk_id",
    "intervieweeId": "interviewee_clerk_id",
    "problemId": "two-sum",
    "status": "active",
    "streamChannelId": "session_channel_507f1f77bcf86cd799439011",
    "code": "",
    "output": null,
    "language": "javascript",
    "notes": "Optional session notes",
    "createdAt": "2024-05-14T10:00:00Z",
    "updatedAt": "2024-05-14T10:00:00Z"
  }
}
```

**Status Codes**:

- `201`: Session created successfully
- `400`: Bad request - Missing or invalid fields
- `401`: Unauthorized
- `500`: Server error

**Example**:

```javascript
const sessionData = {
  problemId: "two-sum",
  intervieweeId: "interviewee_123",
  language: "javascript",
};

const response = await axios.post("/sessions", sessionData);
const sessionId = response.data.data._id;
```

---

### 2. Get Sessions

Retrieves all sessions for the current user (both as interviewer and interviewee).

**Endpoint**: `GET /api/sessions`

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | String | Filter by status (active, completed, paused) |
| role | String | Filter by role (interviewer, interviewee, all) |
| limit | Number | Number of results (default: 10, max: 100) |
| page | Number | Pagination page (default: 1) |

**Response**:

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "interviewerId": "interviewer_123",
        "intervieweeId": "interviewee_456",
        "problemId": "two-sum",
        "status": "completed",
        "createdAt": "2024-05-14T10:00:00Z",
        "completedAt": "2024-05-14T11:00:00Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

**Status Codes**:

- `200`: Sessions retrieved successfully
- `401`: Unauthorized
- `500`: Server error

**Example**:

```javascript
// Get active sessions as interviewer
const response = await axios.get("/sessions", {
  params: {
    status: "active",
    role: "interviewer",
    limit: 10,
  },
});

const sessions = response.data.data.sessions;
```

---

### 3. Get Session Details

Retrieves detailed information about a specific session.

**Endpoint**: `GET /api/sessions/:id`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | MongoDB session ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "interviewerId": "interviewer_123",
    "intervieweeId": "interviewee_456",
    "problemId": "two-sum",
    "status": "active",
    "streamChannelId": "session_507f1f77bcf86cd799439011",
    "code": "function twoSum(nums, target) {\n  // Implementation\n}",
    "output": "[0, 1]",
    "language": "javascript",
    "notes": "Great progress!",
    "createdAt": "2024-05-14T10:00:00Z",
    "updatedAt": "2024-05-14T10:30:00Z"
  }
}
```

**Status Codes**:

- `200`: Session retrieved successfully
- `401`: Unauthorized
- `403`: Forbidden - Not a participant in this session
- `404`: Session not found
- `500`: Server error

**Example**:

```javascript
const sessionId = "session_507f1f77bcf86cd799439011";
const response = await axios.get(`/sessions/${sessionId}`);
const session = response.data.data;
```

---

### 4. Update Session

Updates an existing session with new code, output, or status.

**Endpoint**: `PUT /api/sessions/:id`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | MongoDB session ID |

**Request Body**:

```json
{
  "code": "function twoSum(nums, target) { ... }",
  "output": "[0, 1]",
  "status": "active",
  "notes": "Making progress"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | String | No | Updated code solution |
| output | String | No | Execution output/result |
| status | String | No | Session status (active, completed, paused) |
| notes | String | No | Updated notes |

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "interviewerId": "interviewer_123",
    "intervieweeId": "interviewee_456",
    "problemId": "two-sum",
    "status": "completed",
    "code": "function twoSum(nums, target) { ... }",
    "output": "[0, 1]",
    "notes": "Solution approved!",
    "updatedAt": "2024-05-14T11:00:00Z",
    "completedAt": "2024-05-14T11:00:00Z"
  }
}
```

**Status Codes**:

- `200`: Session updated successfully
- `400`: Bad request - Invalid fields
- `401`: Unauthorized
- `403`: Forbidden - Not a participant in this session
- `404`: Session not found
- `500`: Server error

**Example**:

```javascript
const sessionId = "session_507f1f77bcf86cd799439011";
const updates = {
  code: "const solution = () => {};",
  status: "completed",
  notes: "Excellent work!",
};

const response = await axios.put(`/sessions/${sessionId}`, updates);
const updatedSession = response.data.data;
```

---

### 5. Delete Session

Removes a session (typically done by the interviewer).

**Endpoint**: `DELETE /api/sessions/:id`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | MongoDB session ID |

**Response**:

```json
{
  "success": true,
  "message": "Session deleted successfully",
  "data": {
    "deletedId": "507f1f77bcf86cd799439011"
  }
}
```

**Status Codes**:

- `200`: Session deleted successfully
- `401`: Unauthorized
- `403`: Forbidden - Only interviewer can delete
- `404`: Session not found
- `500`: Server error

---

## Health Check Endpoint

### System Health

Verifies that the API is running and accessible.

**Endpoint**: `GET /health`

**Authentication**: Not required

**Response**:

```json
{
  "msg": "success from API"
}
```

**Status Code**: `200`

---

## Error Responses

### Common Error Codes

| Code             | Status | Description                                        |
| ---------------- | ------ | -------------------------------------------------- |
| UNAUTHORIZED     | 401    | Missing or invalid authentication token            |
| FORBIDDEN        | 403    | Authenticated but not authorized for this resource |
| NOT_FOUND        | 404    | Resource does not exist                            |
| VALIDATION_ERROR | 400    | Invalid request data                               |
| SERVER_ERROR     | 500    | Internal server error                              |
| SESSION_FULL     | 400    | Session already has maximum participants           |
| INVALID_PROBLEM  | 400    | Problem ID does not exist                          |
| STREAM_ERROR     | 500    | Error connecting to Stream.io service              |

### Error Response Example

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Missing or invalid authentication token",
  "statusCode": 401
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Default**: 100 requests per 15 minutes per user
- **Headers**: Rate limit info in response headers
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp of reset time

---

## Pagination

List endpoints support pagination using query parameters:

```
GET /api/sessions?limit=10&page=2
```

**Response includes**:

- `data`: Array of items
- `total`: Total number of items
- `page`: Current page number
- `limit`: Items per page
- `hasMore`: Whether more pages exist

---

## CORS Configuration

Cross-Origin requests are allowed from the frontend URL specified in `CLIENT_URL` environment variable.

**Example Headers**:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Inngest Webhook Endpoints

### Session Completion Event

**Endpoint**: `POST /api/inngest`

Handles asynchronous events triggered by Inngest workflows:

- Session completion
- Code execution results
- User milestones

This is handled automatically by the Inngest SDK and doesn't require direct API calls.

---

## SDK Integration Examples

### JavaScript/TypeScript Frontend

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically adds Clerk token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("clerk_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a session
async function createSession(problemId, intervieweeId) {
  try {
    const response = await api.post("/sessions", {
      problemId,
      intervieweeId,
      language: "javascript",
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to create session:", error);
  }
}

// Update session
async function updateSession(sessionId, updates) {
  try {
    const response = await api.put(`/sessions/${sessionId}`, updates);
    return response.data.data;
  } catch (error) {
    console.error("Failed to update session:", error);
  }
}
```

---

## Postman Collection

Import the following Postman collection for easy API testing:

[Intervinger Postman Collection](./postman-collection.json)

Or create a new request with:

1. Method: GET/POST/PUT/DELETE
2. URL: `http://localhost:5000/api/[endpoint]`
3. Headers: Add `Authorization: Bearer [clerk_token]`
4. Body: JSON data for POST/PUT requests

---

## WebSocket Connections

### Stream Chat WebSocket

Real-time chat updates are handled by Stream Chat SDK automatically:

```javascript
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(apiKey);
await client.connectUser({ id: userId }, token);

// Subscribe to channel messages
const channel = client.channel("messaging", channelId);
await channel.watch();

channel.on("message.new", (event) => {
  console.log("New message:", event.message);
});
```

### Stream Video WebSocket

Video call connections are managed by Stream Video SDK:

```javascript
import { StreamVideo } from "@stream-io/video-react-sdk";

const client = new StreamVideo({ apiKey, token });

// Join call
const call = client.call("default", callId);
await call.join();
```

---

## API Testing Checklist

- [ ] Verify authentication with valid token
- [ ] Test with invalid/expired token
- [ ] Verify CORS headers
- [ ] Test all CRUD operations
- [ ] Verify pagination
- [ ] Test error handling
- [ ] Check rate limiting
- [ ] Verify response format consistency
- [ ] Test edge cases (empty results, large datasets)
- [ ] Monitor performance (response times)

---

## Troubleshooting

### 401 Unauthorized

- Verify Clerk token is valid
- Check token hasn't expired
- Ensure token is in Authorization header

### 403 Forbidden

- Verify user is participant in session
- Check user permissions

### CORS Errors

- Verify frontend URL matches `CLIENT_URL`
- Check browser console for specific CORS errors
- Test with curl/Postman to isolate frontend issues

### Connection Timeout

- Verify API server is running
- Check network connectivity
- Review firewall settings

---

## Changelog

### Version 1.0.0

- Initial API release
- Session management endpoints
- Chat token endpoint
- Authentication with Clerk
