# QNAP Backend API Documentation

This document outlines the API endpoints needed for your QNAP server to support the Holiday Community Portal frontend.

## Base URL
Replace `YOUR_QNAP_API` with your actual QNAP server URL (e.g., `https://your-domain.com/api`)

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 1. Authentication

**POST /api/auth/login**
- Body: `{ email: string, password: string }`
- Response: `{ requires2FA: boolean, sessionId?: string }`

**POST /api/auth/verify-2fa**
- Body: `{ sessionId: string, code: string }`
- Response: `{ token: string, user: User }`

**GET /api/auth/verify**
- Headers: `Authorization: Bearer <token>`
- Response: `{ user: User }`

**POST /api/auth/logout**
- Headers: `Authorization: Bearer <token>`
- Response: `{ success: boolean }`

**User Object:**
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'board' | 'member';
  phone?: string;
}
```

#### 2. News/Bulletin Board

**GET /api/news**
- Headers: `Authorization: Bearer <token>`
- Response: `NewsItem[]`

```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string; // ISO date
  priority: 'normal' | 'important' | 'urgent';
}
```

**POST /api/news**
- Headers: `Authorization: Bearer <token>`
- Body: `{ title: string, content: string, priority: string }`
- Response: `{ id: string }`

#### 3. Chat Rooms

**GET /api/chat/rooms**
- Headers: `Authorization: Bearer <token>`
- Response: `ChatRoom[]`

```typescript
interface ChatRoom {
  id: string;
  name: string;
  description: string;
  unread: number;
}
```

**GET /api/chat/rooms/:roomId/messages**
- Headers: `Authorization: Bearer <token>`
- Query: `?limit=50&before=<messageId>`
- Response: `Message[]`

```typescript
interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string; // ISO date
}
```

**POST /api/chat/rooms/:roomId/messages**
- Headers: `Authorization: Bearer <token>`
- Body: `{ content: string }`
- Response: `{ id: string, timestamp: string }`

**WebSocket:** `ws://YOUR_QNAP_API/api/chat/ws?token=<token>`
- Real-time message delivery
- Message format: `{ type: 'message', data: Message }`

#### 4. Board Section (Requires 'board' or 'admin' role)

**GET /api/board/meetings**
- Headers: `Authorization: Bearer <token>`
- Response: `Meeting[]`

```typescript
interface Meeting {
  id: string;
  title: string;
  date: string; // ISO date
  videoUrl?: string;
  aiNotes?: string;
  status: 'completed' | 'scheduled';
}
```

**GET /api/board/discussions**
- Headers: `Authorization: Bearer <token>`
- Response: `Discussion[]`

```typescript
interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
}
```

#### 5. Admin Section (Requires 'admin' role)

**GET /api/admin/documents**
- Headers: `Authorization: Bearer <token>`
- Query: `?category=legal|financial`
- Response: `Document[]`

```typescript
interface Document {
  id: string;
  name: string;
  category: 'legal' | 'financial';
  date: string; // ISO date
  size: string; // e.g., "2.4 MB"
  url: string; // Download URL
}
```

**POST /api/admin/documents**
- Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- Body: FormData with file and metadata
- Response: `{ id: string, url: string }`

**POST /api/admin/ai-search**
- Headers: `Authorization: Bearer <token>`
- Body: `{ query: string }`
- Response: `{ results: Document[], summary: string }`

## Security Considerations

### SMS 2FA Implementation
Your QNAP backend should integrate with an SMS service (e.g., Twilio, SNS) to:
1. Generate 6-digit codes
2. Store codes with expiration (5-10 minutes)
3. Send via SMS
4. Validate codes (max 3 attempts)

### Rate Limiting
Implement rate limiting on:
- Login attempts: 5 per 15 minutes
- 2FA attempts: 3 per code generation
- API calls: 100 per minute per user

### CORS Configuration
```javascript
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

### JWT Token Configuration
- Secret: Strong random string
- Expiration: 24 hours
- Refresh tokens: Optional but recommended
- Include user role in JWT payload

## Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'board', 'member')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2FA Codes Table
```sql
CREATE TABLE two_fa_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  attempts INT DEFAULT 0,
  used BOOLEAN DEFAULT FALSE
);
```

## Testing the Integration

1. **Test Authentication Flow:**
   ```bash
   # Login
   curl -X POST YOUR_QNAP_API/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   
   # Verify 2FA
   curl -X POST YOUR_QNAP_API/api/auth/verify-2fa \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"xxx","code":"123456"}'
   ```

2. **Test Protected Endpoints:**
   ```bash
   curl YOUR_QNAP_API/api/news \
     -H "Authorization: Bearer <your-token>"
   ```

## Next Steps

1. Set up your QNAP server with Node.js/Express or Python/FastAPI
2. Implement the authentication endpoints with SMS 2FA
3. Create database tables
4. Implement the remaining API endpoints
5. Set up WebSocket for real-time chat
6. Configure HTTPS/SSL certificates
7. Set up reverse proxy (nginx recommended)
8. Test with the frontend application

## Frontend Configuration

Update the API calls in the frontend code by replacing `YOUR_QNAP_API` with your actual QNAP server URL. Search for these patterns:
- `fetch('YOUR_QNAP_API/...`
- `// TODO: Call your QNAP API`

Example:
```typescript
const response = await fetch('https://your-domain.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```
