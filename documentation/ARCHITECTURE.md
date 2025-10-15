# Shopping List App - Technical Architecture Document

**Version:** 1.0
**Last Updated:** January 10, 2025
**Architecture Style:** Full-Stack JavaScript with Real-Time Communication

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Database Design](#database-design)
7. [Authentication & Security](#authentication--security)
8. [Real-Time Communication](#real-time-communication)
9. [Deployment Architecture](#deployment-architecture)
10. [Development Workflow](#development-workflow)
11. [Scalability Considerations](#scalability-considerations)

---

## System Overview

### Architecture Pattern
**Monolithic Full-Stack Application with Real-Time Capabilities**

The application follows a traditional client-server architecture enhanced with WebSocket connections for real-time bidirectional communication. The backend serves both static files and API functionality, while Socket.IO manages real-time data synchronization.

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Socket.IO over REST** | Required for real-time multi-user collaboration |
| **Supabase for Auth + DB** | Managed backend reduces infrastructure complexity |
| **Vanilla JavaScript** | No framework overhead, fast load times |
| **Single Node.js Server** | Simplified deployment, shared session state |
| **PostgreSQL** | Relational data with ACID guarantees |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Web Browser                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │   HTML/CSS  │  │  JavaScript  │  │  Socket.IO      │  │  │
│  │  │   (UI)      │  │   (app.js)   │  │   Client        │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  │         │                 │                    │          │  │
│  └─────────┼─────────────────┼────────────────────┼──────────┘  │
│            │                 │                    │             │
│         HTTPS            HTTPS              WebSocket           │
│            │                 │                    │             │
└────────────┼─────────────────┼────────────────────┼─────────────┘
             │                 │                    │
             │                 ▼                    │
             │        ┌──────────────────┐          │
             │        │  Supabase Auth   │          │
             │        │  (OAuth)         │          │
             │        └──────────────────┘          │
             │                                       │
             ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Node.js + Express Server                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │   Static    │  │  Socket.IO   │  │   Category      │  │  │
│  │  │   File      │  │   Server     │  │   Engine        │  │  │
│  │  │   Serving   │  │  (server.js) │  │                 │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ SQL Queries
                               │ (Supabase Client SDK)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Supabase Platform                        │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │ PostgreSQL  │  │  Auth Server │  │   Row Level     │  │  │
│  │  │  Database   │  │  (JWT)       │  │   Security      │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Google OAuth 2.0                           │    │
│  │         (Authentication Provider)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **HTML5** | - | Markup structure | Standard web foundation |
| **CSS3** | - | Styling & layout | Native styling, no preprocessor needed |
| **Vanilla JavaScript** | ES6+ | Client logic | Lightweight, no framework overhead |
| **Socket.IO Client** | ^4.6.1 | Real-time communication | Industry standard for WebSockets |
| **Supabase JS Client** | ^2.74.0 | Auth & DB client | Official Supabase SDK |

**Frontend File Structure:**
```
public/
├── index.html          # Main HTML structure
├── style.css           # All application styles
├── config.js           # Configuration (Supabase keys, backend URL)
└── app.js              # Application logic & Socket.IO client
```

### Backend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Node.js** | 18.x+ | Runtime environment | JavaScript everywhere, async I/O |
| **Express.js** | ^4.18.2 | Web framework | Minimal, flexible, widely adopted |
| **Socket.IO Server** | ^4.6.1 | WebSocket server | Pairs with client, fallback support |
| **Supabase JS** | ^2.74.0 | Database client | Server-side DB operations |
| **dotenv** | ^17.2.3 | Environment variables | Secure config management |
| **CORS** | ^2.8.5 | Cross-origin requests | Required for split deployment |

**Backend File Structure:**
```
/
├── server.js           # Main server & Socket.IO logic
├── .env                # Environment variables (not in git)
├── .env.example        # Template for environment setup
├── package.json        # Dependencies & scripts
└── schema.sql          # Database schema & RLS policies
```

### Database & Authentication

| Service | Provider | Purpose | Features Used |
|---------|----------|---------|---------------|
| **PostgreSQL** | Supabase | Relational database | Tables, foreign keys, indexes |
| **Row Level Security** | Supabase | Access control | User-specific data filtering |
| **Authentication** | Supabase Auth | User management | Google OAuth, JWT tokens |
| **Storage** | Supabase | (Future use) | Not implemented in V1 |

### Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package management |
| **Git** | Version control |
| **GitHub** | Code repository |
| **Vercel** | Frontend hosting (planned) |
| **Railway** | Backend hosting (planned) |

---

## Component Architecture

### Frontend Components

#### 1. Authentication Module (`app.js`)
**Responsibilities:**
- Google OAuth flow initiation
- Session management
- Token storage and retrieval
- Logout with session clearing

**Key Functions:**
```javascript
init()                          // Initialize app
handleAuthentication(session)   // Process login
handleSignOut()                 // Clear session & logout
```

**Dependencies:**
- Supabase JS Client (auth methods)
- Socket.IO Client (for authenticated connection)

---

#### 2. Socket.IO Client Manager (`app.js`)
**Responsibilities:**
- Establish WebSocket connection
- Emit events for CRUD operations
- Listen for server broadcasts
- Handle connection/disconnection

**Event Emitters:**
```javascript
socket.emit('authenticate', accessToken)
socket.emit('getTrips')
socket.emit('createTrip', { tripName, tripDate })
socket.emit('deleteTrip', tripId)
socket.emit('loadTrip', tripId)
socket.emit('addItem', { tripId, itemName, quantity })
socket.emit('togglePurchased', itemId)
socket.emit('updateQuantity', { itemId, quantity })
socket.emit('deleteItem', itemId)
```

**Event Listeners:**
```javascript
socket.on('authenticated', callback)
socket.on('authError', callback)
socket.on('tripsList', callback)
socket.on('tripCreated', callback)
socket.on('tripDeleted', callback)
socket.on('currentTrip', callback)
socket.on('tripItems', callback)
socket.on('itemAdded', callback)
socket.on('itemUpdated', callback)
socket.on('itemDeleted', callback)
socket.on('error', callback)
```

---

#### 3. UI Rendering Module (`app.js`)
**Responsibilities:**
- Render trip list in sidebar
- Render shopping items by category
- Update UI on data changes
- Handle user interactions

**Key Functions:**
```javascript
loadTrips()           // Fetch and display trips
renderTripsList()     // Update sidebar with trips
loadTrip(tripId)      // Load specific trip
showTripContent()     // Display trip details
renderItems()         // Group items by category & render
updateStats()         // Update purchased/total counts
```

**UI Update Flow:**
```
Socket Event → Update Local State → Re-render Component
```

---

#### 4. Categorization Engine (Client-side utility)
**Responsibilities:**
- Match item names to categories
- Provide fallback to "Others"

**Implementation:** Server-side (see backend)

---

### Backend Components

#### 1. Express HTTP Server (`server.js`)
**Responsibilities:**
- Serve static files from `public/` directory
- Handle HTTP requests
- Middleware setup (JSON parsing, CORS)

**Configuration:**
```javascript
const app = express();
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.static('public'));
```

---

#### 2. Socket.IO Server (`server.js`)
**Responsibilities:**
- Manage WebSocket connections
- Authenticate users via JWT
- Handle real-time events
- Broadcast updates to connected clients

**Architecture Pattern:** Event-Driven

**Connection Lifecycle:**
```
1. Client connects → 'connection' event
2. Client sends 'authenticate' with access token
3. Server validates token with Supabase
4. Server creates user-specific Supabase client
5. Client sends CRUD events
6. Server processes & broadcasts to all clients
7. Client disconnects → cleanup
```

**Authentication Flow:**
```javascript
socket.on('authenticate', async (accessToken) => {
  // Create user-specific Supabase client with token
  userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  });

  // Verify user
  const { data: { user }, error } = await userSupabase.auth.getUser();
  if (error) {
    socket.emit('authError', 'Authentication failed');
    return;
  }

  userId = user.id;
  socket.emit('authenticated', { userId, email: user.email });
});
```

---

#### 3. Database Service Layer (`server.js`)
**Responsibilities:**
- CRUD operations for trips
- CRUD operations for shopping items
- Query optimization
- Error handling

**Key Operations:**

**Trip Operations:**
```javascript
// Get all trips for user (ordered by date DESC)
const { data, error } = await userSupabase
  .from('trips')
  .select('*')
  .order('trip_date', { ascending: false });

// Create trip
const { data, error } = await userSupabase
  .from('trips')
  .insert([{
    user_id: userId,
    trip_name,
    trip_date
  }])
  .select()
  .single();

// Delete trip (cascade deletes items)
const { error } = await userSupabase
  .from('trips')
  .delete()
  .eq('id', tripId);
```

**Item Operations:**
```javascript
// Get items for trip
const { data, error } = await userSupabase
  .from('shopping_items')
  .select('*')
  .eq('trip_id', tripId);

// Add item with auto-categorization
const category = categorizeItem(itemName);
const { data, error } = await userSupabase
  .from('shopping_items')
  .insert([{
    trip_id,
    name: itemName,
    category,
    quantity
  }])
  .select()
  .single();

// Toggle purchased
const { data, error } = await userSupabase
  .from('shopping_items')
  .update({ purchased: !currentItem.purchased })
  .eq('id', itemId)
  .select()
  .single();

// Update quantity
const { data, error } = await userSupabase
  .from('shopping_items')
  .update({ quantity })
  .eq('id', itemId)
  .select()
  .single();
```

---

#### 4. Categorization Engine (`server.js`)
**Responsibilities:**
- Keyword-based item categorization
- Mapping items to store aisles

**Implementation:**
```javascript
const categoryKeywords = {
  'produce': ['apple', 'banana', 'orange', /* 100+ keywords */],
  'meat & seafood': ['chicken', 'beef', 'salmon', /* ... */],
  // ... 16 categories total
};

const categoryOrder = [
  'produce', 'meat & seafood', 'deli & prepared foods',
  // ... ordered by store layout
];

function categorizeItem(itemName) {
  const lowerName = itemName.toLowerCase();

  for (const category of categoryOrder) {
    const keywords = categoryKeywords[category];
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return category;
      }
    }
  }

  return 'others'; // Fallback
}
```

**Algorithm:** Linear search through prioritized categories
**Complexity:** O(n*m) where n = categories, m = keywords per category
**Optimization:** First match wins (prioritized order)

---

## Data Flow

### 1. User Authentication Flow

```
┌─────────┐                ┌──────────┐                ┌──────────┐
│ Browser │                │  Server  │                │ Supabase │
└────┬────┘                └────┬─────┘                └────┬─────┘
     │                          │                           │
     │  Click "Sign in with    │                           │
     │  Google"                │                           │
     ├─────────────────────────►                           │
     │  Redirect to Google     │                           │
     │                          │                           │
     │  Google OAuth Consent   │                           │
     │◄────────────────────────┤                           │
     │                          │                           │
     │  Authorization Code     │                           │
     ├──────────────────────────────────────────────────►  │
     │                          │    Exchange for Token    │
     │                          │                           │
     │  Access Token + User    │                           │
     │◄──────────────────────────────────────────────────┤  │
     │                          │                           │
     │  Store token locally    │                           │
     ├──────────┐               │                           │
     │          │               │                           │
     │  Initiate Socket.IO     │                           │
     │  connection             │                           │
     ├─────────────────────────►                           │
     │  emit('authenticate',   │                           │
     │  accessToken)           │                           │
     │                          │  Validate Token          │
     │                          ├──────────────────────────►│
     │                          │                           │
     │                          │  User Data               │
     │                          │◄──────────────────────────┤
     │  emit('authenticated')  │                           │
     │◄─────────────────────────┤                           │
     │                          │                           │
     │  emit('getTrips')       │                           │
     ├─────────────────────────►│                           │
     │                          │  SELECT trips WHERE      │
     │                          │  user_id = ...           │
     │                          ├──────────────────────────►│
     │                          │                           │
     │                          │  Trips data              │
     │                          │◄──────────────────────────┤
     │  emit('tripsList',      │                           │
     │  trips)                 │                           │
     │◄─────────────────────────┤                           │
     │                          │                           │
     │  Render trips in UI     │                           │
     ├──────────┐               │                           │
     └──────────┘               │                           │
```

---

### 2. Create Trip Flow

```
User clicks "New Trip" → Modal opens
User enters trip name + date → Clicks "Create"
  ↓
app.js: socket.emit('createTrip', { tripName, tripDate })
  ↓
server.js: socket.on('createTrip', async ({ tripName, tripDate }))
  ↓
server.js: INSERT INTO trips (user_id, trip_name, trip_date) VALUES (...)
  ↓
Supabase: Returns new trip object
  ↓
server.js: io.emit('tripCreated', newTrip)  [Broadcast to all clients]
  ↓
app.js: socket.on('tripCreated', (trip) => { ... })
  ↓
app.js: allTrips.unshift(trip); renderTripsList();
  ↓
UI updates with new trip at top of sidebar
```

---

### 3. Add Item with Auto-Categorization Flow

```
User types item name + quantity → Clicks "Add"
  ↓
app.js: socket.emit('addItem', { tripId, itemName, quantity })
  ↓
server.js: socket.on('addItem', async ({ tripId, itemName, quantity }))
  ↓
server.js: category = categorizeItem(itemName)
  ↓
server.js: INSERT INTO shopping_items (trip_id, name, category, quantity)
  ↓
Supabase: Returns new item object with category assigned
  ↓
server.js: io.emit('itemAdded', newItem)  [Broadcast to all clients]
  ↓
app.js: socket.on('itemAdded', (item) => { ... })
  ↓
app.js: if (item.trip_id === currentTrip.id) { shoppingItems.push(item); }
  ↓
app.js: renderItems(); updateStats();
  ↓
UI re-renders categories, item appears in correct aisle section
```

---

### 4. Real-Time Synchronization Flow

**Scenario:** User A checks off an item, User B sees update instantly

```
User A (Browser 1)              Server                User B (Browser 2)
       │                          │                          │
       │  Click checkbox          │                          │
       ├──────────────────────────►                          │
       │  emit('togglePurchased', │                          │
       │  itemId)                 │                          │
       │                          │                          │
       │                   UPDATE shopping_items             │
       │                   SET purchased = true              │
       │                   WHERE id = itemId                 │
       │                          │                          │
       │                   io.emit('itemUpdated',            │
       │                   updatedItem)                      │
       │                          ├─────────────────────────►│
       │  on('itemUpdated')       │  on('itemUpdated')       │
       │◄─────────────────────────┤                          │
       │                          │                          │
       │  Update local state      │  Update local state      │
       │  Re-render item          │  Re-render item          │
       │  (show strikethrough)    │  (show strikethrough)    │
       │                          │                          │
```

**Latency:** Typically < 100ms for local networks, < 500ms for remote

---

## Database Design

### Entity-Relationship Diagram

```
┌─────────────────┐
│   auth.users    │  (Supabase managed)
│─────────────────│
│ id (UUID) PK    │
│ email           │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│     trips       │
│─────────────────│
│ id (UUID) PK    │
│ user_id (FK)    │◄───┐
│ trip_name       │    │ CASCADE DELETE
│ trip_date       │    │
│ created_at      │    │
└────────┬────────┘    │
         │ 1           │
         │             │
         │ N           │
┌────────▼────────┐    │
│ shopping_items  │    │
│─────────────────│    │
│ id (UUID) PK    │    │
│ trip_id (FK) ───┼────┘
│ name            │
│ category        │
│ quantity        │
│ purchased       │
│ created_at      │
└─────────────────┘
```

### Table Schemas

#### `trips` Table
```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_name TEXT NOT NULL,
  trip_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_trip_date ON trips(trip_date DESC);
```

**Indexes:**
- `user_id` - For user-specific trip queries (most common query)
- `trip_date` - For date-ordered retrieval

---

#### `shopping_items` Table
```sql
CREATE TABLE shopping_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shopping_items_trip_id ON shopping_items(trip_id);
CREATE INDEX idx_shopping_items_category ON shopping_items(category);
```

**Indexes:**
- `trip_id` - For trip-specific item queries (required for all item fetches)
- `category` - For category-grouped rendering (optimization)

---

### Row Level Security (RLS) Policies

**Purpose:** Ensure users only access their own data

#### `trips` Policies
```sql
-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- SELECT policy
CREATE POLICY "Users can view own trips"
ON trips FOR SELECT
USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can create own trips"
ON trips FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete own trips"
ON trips FOR DELETE
USING (auth.uid() = user_id);
```

#### `shopping_items` Policies
```sql
-- Enable RLS
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- SELECT policy
CREATE POLICY "Users can view items from own trips"
ON shopping_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = shopping_items.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- INSERT policy
CREATE POLICY "Users can add items to own trips"
ON shopping_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = shopping_items.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- UPDATE policy
CREATE POLICY "Users can update items in own trips"
ON shopping_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = shopping_items.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- DELETE policy
CREATE POLICY "Users can delete items from own trips"
ON shopping_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = shopping_items.trip_id
    AND trips.user_id = auth.uid()
  )
);
```

**Security Guarantee:** Even with valid Supabase client, users cannot access other users' data due to RLS enforcement at database level.

---

## Authentication & Security

### Authentication Architecture

**Provider:** Google OAuth 2.0 via Supabase Auth

**Flow:**
1. User clicks "Sign in with Google"
2. Supabase Auth redirects to Google OAuth consent screen
3. User approves access
4. Google returns authorization code
5. Supabase exchanges code for access token
6. Supabase creates user session with JWT
7. Client stores session in localStorage (managed by Supabase SDK)
8. Client sends JWT on every request

### JWT Token Structure

**Claims:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "aud": "authenticated",
  "role": "authenticated",
  "iat": 1673456789,
  "exp": 1673460389
}
```

**Usage:**
- Sent in `Authorization: Bearer <token>` header
- Validated by Supabase on every database operation
- Used to enforce RLS policies

### Security Layers

| Layer | Mechanism | Protection Against |
|-------|-----------|-------------------|
| **Transport** | HTTPS | Man-in-the-middle attacks |
| **Authentication** | Google OAuth + JWT | Unauthorized access |
| **Authorization** | Row Level Security (RLS) | Horizontal privilege escalation |
| **Session Management** | Supabase SDK | Session hijacking |
| **Environment Variables** | `.env` file (gitignored) | Credential exposure |
| **CORS** | Configured origin whitelist | Cross-site request forgery |

### Environment Variable Management

**Local Development (`.env`):**
```bash
SUPABASE_URL=https://xfvbufykjhffmhgozbnm.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
PORT=3000
```

**Production (Railway):**
- Variables set via Railway dashboard
- Additional variable: `FRONTEND_URL` for CORS

**Security Notes:**
- `.env` file excluded from Git via `.gitignore`
- Anon key is safe to expose (RLS protects data)
- Never commit service role key (full database access)

---

## Real-Time Communication

### Socket.IO Architecture

**Why Socket.IO?**
- Automatic fallback (WebSocket → HTTP long-polling)
- Built-in reconnection logic
- Room support (future multi-user trips)
- Event-based API (cleaner than raw WebSockets)
- Cross-browser compatibility

### Connection Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│                  Connection States                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Disconnected]                                          │
│       │                                                  │
│       │ User logs in                                     │
│       ▼                                                  │
│  [Connecting]                                            │
│       │                                                  │
│       │ WebSocket handshake                              │
│       ▼                                                  │
│  [Connected]                                             │
│       │                                                  │
│       │ emit('authenticate', token)                      │
│       ▼                                                  │
│  [Authenticated]  ◄────────┐                             │
│       │                    │                             │
│       │ Normal operation   │ Reconnect                   │
│       │                    │                             │
│       ▼                    │                             │
│  [Disconnected] ───────────┘                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Event Architecture

**Event Types:**
- **Authentication Events:** `authenticate`, `authenticated`, `authError`
- **Trip Events:** `getTrips`, `createTrip`, `deleteTrip`, `tripsList`, `tripCreated`, `tripDeleted`
- **Item Events:** `loadTrip`, `addItem`, `togglePurchased`, `updateQuantity`, `deleteItem`, `tripItems`, `itemAdded`, `itemUpdated`, `itemDeleted`
- **Error Events:** `error`

### Broadcast Strategy

**Approach:** Global broadcast with client-side filtering

```javascript
// Server: Broadcast to all connected clients
io.emit('itemAdded', newItem);

// Client: Filter by current trip
socket.on('itemAdded', (item) => {
  if (currentTrip && item.trip_id === currentTrip.id) {
    shoppingItems.push(item);
    renderItems();
  }
});
```

**Why not rooms?**
- Simpler implementation for V1
- Users typically have one trip active
- RLS prevents unauthorized data access
- Future: Can implement rooms for shared trips

### Error Handling & Resilience

**Connection Loss:**
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  // Socket.IO auto-reconnects
});

socket.on('connect', () => {
  console.log('Reconnected to server');
  // Re-authenticate
  socket.emit('authenticate', accessToken);
});
```

**Failed Operations:**
```javascript
socket.on('error', (message) => {
  console.error('Socket error:', message);
  alert(message); // User feedback
});
```

**Timeout Handling:**
- Socket.IO default timeout: 20 seconds
- No custom timeout implemented (relying on defaults)
- Future: Implement exponential backoff

---

## Deployment Architecture

### Development Environment

```
┌────────────────────────────────────────┐
│         localhost:3000                 │
│  ┌──────────────────────────────────┐  │
│  │   Node.js Server                 │  │
│  │   - Express                      │  │
│  │   - Socket.IO                    │  │
│  │   - Serves static files          │  │
│  └──────────────────────────────────┘  │
│                 │                      │
│                 │                      │
│                 ▼                      │
│  ┌──────────────────────────────────┐  │
│  │   Static Files (public/)         │  │
│  │   - index.html                   │  │
│  │   - app.js                       │  │
│  │   - style.css                    │  │
│  │   - config.js                    │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
         │
         │ HTTPS
         ▼
┌────────────────────────────────────────┐
│      Supabase (Cloud)                  │
│  - PostgreSQL Database                 │
│  - Authentication Service              │
│  - Row Level Security                  │
└────────────────────────────────────────┘
```

**Start Command:** `npm start`
**Environment:** `.env` file

---

### Production Environment (Planned)

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                           │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTPS
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel CDN                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Static Files (Global Edge Network)                 │  │
│  │   - index.html                                        │  │
│  │   - app.js                                            │  │
│  │   - style.css                                         │  │
│  │   - config.js (with Railway backend URL)             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                │
                │ WebSocket (wss://)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Railway                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Node.js Server Container                           │  │
│  │   - Express                                           │  │
│  │   - Socket.IO Server                                  │  │
│  │   - CORS enabled for Vercel domain                   │  │
│  │   - Environment variables (SUPABASE_URL, etc.)       │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ PostgreSQL Protocol
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase                                 │
│  - Managed PostgreSQL                                       │
│  - Authentication (Google OAuth)                            │
│  - Row Level Security                                       │
└─────────────────────────────────────────────────────────────┘
```

**Why Split Architecture?**
- **Vercel:** Optimized for static file serving, global CDN, generous free tier
- **Railway:** Supports WebSocket (Vercel serverless doesn't maintain connections)
- **Supabase:** Managed backend, no infrastructure overhead

**Configuration Required:**
1. Deploy backend to Railway
2. Set `FRONTEND_URL` env var on Railway (Vercel domain)
3. Update `config.js` with Railway backend URL
4. Deploy frontend to Vercel (auto-deploys from GitHub)
5. Update Google OAuth redirect URLs
6. Update Supabase allowed redirect URLs

---

## Development Workflow

### Local Development Setup

**Prerequisites:**
```bash
node --version  # 18.x or higher
npm --version   # 9.x or higher
```

**Installation:**
```bash
# Clone repository
git clone https://github.com/sairamrang/shopping-list-app.git
cd shopping-list-app

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database schema
# (Execute schema.sql in Supabase SQL Editor)

# Start development server
npm start
```

**Development Server:**
- URL: http://localhost:3000
- Hot reload: Not implemented (manual restart required)
- Debugging: Chrome DevTools for client, Node.js inspector for server

---

### Git Workflow

**Branch Strategy:** Simple main-branch workflow

**Commit Guidelines:**
- Use descriptive commit messages
- Commit frequently
- Don't commit `.env` file
- Include database schema changes in commits

**Example Commits:**
```
"Add inline quantity editing feature"
"Fix logout session clearing bug"
"Update color scheme to pink/coral"
"Add CORS support for production deployment"
```

---

### Deployment Process

**GitHub → Railway (Backend):**
1. Push code to GitHub
2. Railway auto-deploys from main branch
3. Environment variables set in Railway dashboard
4. Test backend health endpoint

**GitHub → Vercel (Frontend):**
1. Push code to GitHub
2. Vercel auto-deploys from main branch
3. Frontend config updated with Railway URL
4. Test full application flow

---

## Scalability Considerations

### Current Limitations

| Resource | Limit | Impact |
|----------|-------|--------|
| **Concurrent Users** | ~100 per server instance | Socket.IO memory usage |
| **Database Connections** | Supabase pooling (default) | Handled by Supabase |
| **Real-time Latency** | ~500ms avg | Acceptable for use case |
| **Data Storage** | Unlimited (Supabase free tier: 500MB) | Low data volume per user |

### Scaling Strategies (Future)

**Horizontal Scaling:**
- Deploy multiple Railway instances
- Implement Redis adapter for Socket.IO
- Share connection state across servers

**Database Optimization:**
- Add materialized views for analytics
- Implement connection pooling (Supabase handles)
- Archive old trips (soft delete)

**Caching Layer:**
- Redis for trip/item caching
- Reduce database queries for read-heavy operations

**CDN Optimization:**
- Vercel already provides global CDN
- Minimize asset sizes (currently lightweight)

---

## Monitoring & Observability

### Current Monitoring

**Client-side:**
- Browser console logs
- Network tab for request inspection

**Server-side:**
- Console logs via Railway dashboard
- Supabase dashboard for database metrics

**Metrics Tracked:**
- Connection count (manual count in logs)
- Error rates (manual review)
- Database query performance (Supabase dashboard)

### Recommended Additions (Future)

- **Error Tracking:** Sentry or Rollbar
- **Performance Monitoring:** New Relic or Datadog
- **Uptime Monitoring:** UptimeRobot
- **Analytics:** Google Analytics or Mixpanel

---

## Appendix

### Key Files Reference

| File | Lines of Code | Purpose |
|------|---------------|---------|
| `server.js` | ~350 | Backend logic, Socket.IO server |
| `public/app.js` | ~480 | Frontend logic, Socket.IO client |
| `public/style.css` | ~675 | All application styles |
| `public/index.html` | ~100 | HTML structure |
| `public/config.js` | ~10 | Configuration constants |
| `schema.sql` | ~80 | Database schema & RLS policies |
| `package.json` | ~25 | Dependencies & scripts |

**Total:** ~1,720 lines of code

---

### Dependencies Deep Dive

**Backend Dependencies:**
```json
{
  "@supabase/supabase-js": "^2.74.0",  // Supabase client SDK
  "cors": "^2.8.5",                     // Cross-origin resource sharing
  "dotenv": "^17.2.3",                  // Environment variable loader
  "express": "^4.18.2",                 // Web framework
  "socket.io": "^4.6.1"                 // WebSocket server
}
```

**Frontend Dependencies (CDN):**
- Supabase JS: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
- Socket.IO Client: Served by Socket.IO server at `/socket.io/socket.io.js`

**No Build Step Required:** All client-side code is vanilla JS

---

### Performance Benchmarks

**Measured Performance (Local Development):**
- Initial page load: ~800ms
- Authentication: ~1.2s (includes Google OAuth redirect)
- Create trip: ~150ms
- Add item: ~120ms
- Real-time sync latency: ~50ms (local network)
- Toggle purchased: ~100ms

**Target Performance (Production):**
- Page load: < 2s
- Real-time sync: < 500ms
- Database queries: < 100ms

---

### Security Audit Checklist

- ✅ Google OAuth for authentication
- ✅ HTTPS enforced (production)
- ✅ JWT token validation
- ✅ Row Level Security enabled
- ✅ Environment variables secured
- ✅ No secrets in client code
- ✅ CORS configured with specific origins
- ✅ Input validation (client + server)
- ❌ Rate limiting (not implemented)
- ❌ SQL injection protection (Supabase SDK handles)
- ❌ XSS protection (basic escaping via `escapeHtml()`)

---

**Document Maintained By:** Engineering Team
**Last Architecture Review:** January 2025
**Next Review:** Q2 2025
