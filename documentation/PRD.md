# Shopping List App - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** January 10, 2025
**Status:** Production Ready

---

## Executive Summary

A collaborative, real-time shopping list application designed for young families to manage grocery shopping trips efficiently. The application provides trip-based organization, automatic categorization by store aisles, and multi-user real-time synchronization.

---

## Product Vision

Create a delightful shopping experience for families by organizing shopping lists into trips, automatically categorizing items by store layout, and enabling real-time collaboration between family members.

---

## Target Audience

**Primary Users:** Young families (Gen X and Gen Z parents)
- Households with 2+ family members
- Grocery shoppers who make multiple trips per week
- Users comfortable with modern web applications
- Families who coordinate shopping responsibilities

**User Personas:**

**Sarah, 34 (Primary Shopper)**
- Manages household grocery shopping
- Makes 2-3 store trips per week
- Coordinates with spouse on shopping needs
- Values organization and efficiency

**Mike, 36 (Contributing Member)**
- Adds items to list throughout the week
- Occasionally does shopping
- Wants quick, simple interface
- Uses mobile device primarily

---

## Core Features & Requirements

### 1. Authentication & User Management

**Feature:** Google OAuth Single Sign-On

**Requirements:**
- Users must authenticate via Google Gmail account
- Secure session management with Supabase Auth
- Automatic logout clears all local session data
- Support for "Sign Out" with global scope clearing

**User Stories:**
- As a user, I want to sign in with my Google account so I don't have to create another password
- As a user, I want to be completely logged out when I click "Sign Out" so my data is secure
- As a user, I want my session to persist so I don't have to log in every time

**Acceptance Criteria:**
- ✅ Google OAuth integration via Supabase
- ✅ Session persistence across browser refreshes
- ✅ Complete session clearing on logout (localStorage + sessionStorage)
- ✅ User email displayed in interface
- ✅ Redirect URLs configured for localhost and production

---

### 2. Trip Management

**Feature:** Shopping Trip Organization

**Requirements:**
- Users can create multiple shopping trips
- Each trip has a unique name and date
- Trips are displayed in reverse chronological order (newest first)
- Trip list shown in left sidebar panel
- Active trip highlighted with visual indicator
- Ability to delete trips with confirmation

**User Stories:**
- As a user, I want to create named trips (e.g., "Weekly Groceries", "BBQ Party") so I can organize different shopping occasions
- As a user, I want to see trip dates so I can track when I planned each shopping trip
- As a user, I want to delete old trips so my list stays organized
- As a user, I want to see previous trips so I can reference what I bought before

**Acceptance Criteria:**
- ✅ Create trip with custom name and date
- ✅ Display trips in sidebar with name and formatted date
- ✅ Visual indication of selected/active trip
- ✅ Delete trip with "X" button and confirmation dialog
- ✅ Cascade delete all items when trip is deleted
- ✅ Empty state message when no trips exist

**UI/UX Requirements:**
- Trip date picker defaults to today's date
- Trip name input validates for non-empty string
- Active trip has pink gradient background
- Deleted trip removes from view immediately
- Modal overlay for new trip creation

---

### 3. Item Management

**Feature:** Shopping List Items with Quantities

**Requirements:**
- Add items with name and quantity
- Inline quantity editing (click to edit)
- Mark items as purchased with checkbox
- Visual strike-through for purchased items
- Delete individual items
- Items automatically categorized by store aisle
- Real-time synchronization across all connected clients

**User Stories:**
- As a user, I want to add items with quantities so I know how much to buy
- As a user, I want to edit quantities inline so I can quickly update amounts
- As a user, I want to check off items as I shop so I track my progress
- As a user, I want items categorized by aisle so I can shop efficiently
- As a user, I want changes to sync immediately so my family sees updates in real-time

**Acceptance Criteria:**
- ✅ Add item form with name input and quantity input (numeric only)
- ✅ Quantity defaults to 1
- ✅ Click on quantity number to edit via prompt dialog
- ✅ Checkbox toggles purchased status
- ✅ Delete button styled as circular "×" icon
- ✅ Visual feedback for purchased items (opacity + strike-through)
- ✅ Real-time updates via Socket.IO

**Validation Rules:**
- Item name: Required, non-empty string
- Quantity: Positive integer, minimum 1
- Quantity edit: Validates numeric input, rejects invalid values

---

### 4. Auto-Categorization System

**Feature:** Intelligent Item Categorization by Store Aisles

**Requirements:**
- 16 predefined store aisle categories
- Keyword-based automatic categorization
- Items grouped by category in shopping list view
- Category headers with item counts
- Distinct colors for each category
- Category icons for visual identification

**Categories:**
1. 🥬 Produce
2. 🥩 Meat & Seafood
3. 🥓 Deli & Prepared Foods
4. 🥛 Dairy & Eggs
5. 🧊 Frozen Foods
6. 🍞 Bakery
7. 🥫 Pantry & Canned Goods
8. 🫒 Oils & Condiments
9. 🌶️ Spices & Baking
10. 🥣 Breakfast & Cereal
11. 🍿 Snacks
12. 🥤 Beverages
13. 🧹 Household & Cleaning
14. 🧴 Personal Care
15. 👶 Baby & Kids
16. 🐾 Pet Supplies
17. 📦 Others (fallback)

**User Stories:**
- As a user, I want items automatically sorted by aisle so I can navigate the store efficiently
- As a user, I want visual category headers so I can quickly scan sections
- As a user, I want category-specific colors so I can distinguish sections at a glance

**Acceptance Criteria:**
- ✅ Keyword matching algorithm categorizes items automatically
- ✅ Category headers display with emoji icons
- ✅ Item count shown per category
- ✅ Distinct background colors for each category
- ✅ Categories only shown if they contain items
- ✅ Fallback to "Others" category for unmatched items

**Categorization Logic:**
- Case-insensitive keyword matching
- First match wins (prioritized keyword list)
- Comprehensive keyword database per category
- Examples:
  - "milk" → Dairy & Eggs
  - "chicken breast" → Meat & Seafood
  - "paper towels" → Household & Cleaning

---

### 5. Real-Time Collaboration

**Feature:** Multi-User Synchronization via Socket.IO

**Requirements:**
- Real-time updates when any user modifies data
- Automatic synchronization of trips, items, and status changes
- No manual refresh required
- Connection status handling
- Graceful reconnection on network interruption

**User Stories:**
- As a family member, I want to see items added by others immediately so we coordinate shopping
- As a user, I want my checkbox changes to sync so others know what's been purchased
- As a user, I want quantity updates to sync so everyone sees the correct amounts

**Acceptance Criteria:**
- ✅ Socket.IO WebSocket connection established on authentication
- ✅ Broadcast events for all CRUD operations
- ✅ Immediate UI updates on receiving events
- ✅ User-specific data filtering (Row Level Security)
- ✅ Automatic reconnection on disconnect

**Real-Time Events:**
- `authenticate` - User authentication with access token
- `getTrips` - Fetch user's trips
- `createTrip` - New trip created
- `deleteTrip` - Trip deleted
- `loadTrip` - Load specific trip items
- `addItem` - Item added to trip
- `togglePurchased` - Item purchased status changed
- `updateQuantity` - Item quantity updated
- `deleteItem` - Item removed

---

### 6. User Interface & Design

**Feature:** Modern, Family-Friendly Design System

**Requirements:**
- Warm pink-to-coral color palette
- Responsive layout (desktop, tablet, mobile)
- Intuitive navigation
- Visual feedback for all interactions
- Accessible design patterns

**Color Palette:**
- Primary Gradient: `#FF6B9D` to `#FFA06B` (Pink to Coral)
- Active States: `#FF6B9D` (Pink)
- Backgrounds: Light pink (`#ffe0ec`) for hovers
- Text: Dark gray for readability
- Delete Actions: Red (`#ff4757`)

**User Stories:**
- As a user, I want an attractive, colorful interface so shopping feels fun
- As a user, I want clear visual feedback so I know my actions worked
- As a user, I want the app to work on my phone so I can use it while shopping

**Acceptance Criteria:**
- ✅ Pink/coral gradient backgrounds
- ✅ Hover states on interactive elements
- ✅ Smooth transitions and animations
- ✅ Mobile-responsive sidebar
- ✅ Clear typography and spacing
- ✅ Accessible color contrast ratios

**Key UI Components:**
- **Sidebar:** Trip list with active highlighting
- **Main Content:** Current trip items organized by category
- **Add Item Section:** Fixed at top for easy access
- **Category Sections:** Collapsible groups with headers
- **Item Rows:** Checkbox, name, quantity, delete button
- **Modals:** Overlays for trip creation

---

## Data Model

### Database Schema (Supabase PostgreSQL)

**Table: `trips`**
```sql
- id: UUID (Primary Key, auto-generated)
- user_id: UUID (Foreign Key → auth.users)
- trip_name: TEXT (NOT NULL)
- trip_date: TIMESTAMP WITH TIME ZONE (Default: NOW())
- created_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
```

**Table: `shopping_items`**
```sql
- id: UUID (Primary Key, auto-generated)
- trip_id: UUID (Foreign Key → trips, CASCADE DELETE)
- name: TEXT (NOT NULL)
- category: TEXT (NOT NULL)
- quantity: INTEGER (Default: 1)
- purchased: BOOLEAN (Default: FALSE)
- created_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
```

**Row Level Security (RLS) Policies:**
- Users can only read/write their own trips
- Users can only read/write items in their own trips
- Enforced via `user_id` matching authenticated user

---

## Technical Constraints

### Performance Requirements
- Real-time updates: < 200ms latency
- Page load time: < 2 seconds
- Supports up to 10 concurrent users per account
- Database queries optimized with indexes

### Security Requirements
- Google OAuth for authentication
- HTTPS only in production
- Environment variables for secrets
- Row Level Security on all database tables
- JWT token validation on server

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- JavaScript required (no graceful degradation)

---

## Success Metrics

### User Engagement
- Daily active users
- Average trips created per week
- Average items per trip
- Return user rate

### Performance Metrics
- Real-time sync latency
- Server uptime (target: 99.9%)
- Database query performance
- WebSocket connection stability

### User Satisfaction
- Task completion rate
- Time to create trip and add items
- User retention after 30 days

---

## Future Enhancements (Out of Scope for V1)

### Potential Features
1. **Recipe Integration**
   - Import ingredients from recipes
   - Recipe-to-shopping-list conversion

2. **Smart Suggestions**
   - Frequently bought items
   - Seasonal recommendations
   - Predictive item suggestions

3. **Store Templates**
   - Custom aisle layouts per store
   - Store-specific categorization
   - Location-based store selection

4. **Sharing & Permissions**
   - Share trips with non-users via link
   - Family group management
   - Permission levels (view/edit)

5. **Price Tracking**
   - Item price history
   - Budget tracking per trip
   - Cost estimation

6. **Mobile Native Apps**
   - iOS native app
   - Android native app
   - Offline support

7. **Voice Input**
   - Voice-to-text item addition
   - Hands-free shopping mode

8. **Barcode Scanning**
   - Add items by scanning products
   - Quick re-ordering

---

## Deployment & Operations

### Deployment Strategy
- **Frontend:** Vercel (Static hosting, global CDN)
- **Backend:** Railway (Node.js, Socket.IO support)
- **Database:** Supabase (Managed PostgreSQL)
- **Authentication:** Supabase Auth + Google OAuth

### Environment Configuration
- Development: `localhost:3000`
- Production: Vercel domain + Railway backend
- Environment variables managed per platform

### Monitoring & Support
- Error logging via console
- User authentication tracking
- Database performance monitoring via Supabase dashboard

---

## Glossary

- **Trip:** A named collection of shopping items with an associated date
- **Item:** An individual product to purchase with quantity and category
- **Category:** Store aisle grouping for items
- **Real-time Sync:** Instant data updates across connected clients
- **Row Level Security (RLS):** Database-level access control per user
- **Socket.IO:** WebSocket library for real-time bidirectional communication
- **Supabase:** Backend-as-a-Service platform (database + auth)

---

## Appendix

### Development History
- **Phase 1:** Basic functionality with categorization
- **Phase 2:** Trip management and database integration
- **Phase 3:** Google OAuth authentication
- **Phase 4:** Real-time synchronization via Socket.IO
- **Phase 5:** UI/UX improvements (color scheme, inline editing)
- **Phase 6:** Production deployment preparation

### Key Decisions
1. **Socket.IO over REST:** Chosen for real-time collaboration requirements
2. **Supabase over custom backend:** Faster development, managed infrastructure
3. **Google OAuth:** Most accessible for target audience
4. **Keyword-based categorization:** Simple, fast, extensible
5. **Trip-based organization:** Better than single perpetual list for family use

---

**Document Prepared By:** Development Team
**Approved By:** Product Owner
**Next Review Date:** February 2025
