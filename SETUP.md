# Shopping List App - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- A Supabase account (free tier works)
- A Google Cloud Project for OAuth (for Google Sign-In)

## Database Setup

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Database Schema
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `schema.sql` file
4. Paste and run it in the SQL Editor
5. This will create:
   - `trips` table (stores shopping trips)
   - `shopping_items` table (stores items for each trip)
   - Row Level Security policies
   - Indexes for performance

### 3. Enable Google OAuth in Supabase

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://xfvbufykjhffmhgozbnm.supabase.co` (your Supabase project URL)
7. Add authorized redirect URIs:
   - `https://xfvbufykjhffmhgozbnm.supabase.co/auth/v1/callback`
8. Save and copy your Client ID and Client Secret

#### Step 2: Configure Supabase Authentication
1. In your Supabase dashboard, go to Authentication → Providers
2. Find "Google" and enable it
3. Paste your Google Client ID and Client Secret
4. Save the configuration

## Application Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The `.env` file is already configured with your Supabase credentials:
```
SUPABASE_URL=https://xfvbufykjhffmhgozbnm.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

### 3. Start the Application
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Features

### 1. Google Authentication
- Users sign in with their Google account
- Supabase handles the OAuth flow
- Each user has their own isolated data

### 2. Trip Management
- Create multiple shopping trips with names and dates
- View all previous trips in the sidebar
- Click on any trip to view its items
- Each trip is labeled with a name and date

### 3. Smart Categorization
Items are automatically categorized into store aisles:
- Produce
- Meat & Seafood
- Deli & Prepared Foods
- Dairy & Eggs
- Frozen Foods
- Bakery
- Pantry & Canned Goods
- Oils & Condiments
- Spices & Baking
- Breakfast & Cereal
- Snacks
- Beverages
- Household & Cleaning
- Personal Care
- Baby & Kids
- Pet Supplies

### 4. Real-time Sync
- Changes sync in real-time across all connected clients
- Using Socket.IO for instant updates
- Perfect for shopping with family members

### 5. Persistent Storage
- All data stored in Supabase PostgreSQL database
- Survives server restarts
- Backed up automatically by Supabase

## How to Use

1. **Sign In**: Click "Sign in with Google" on the home page
2. **Create a Trip**: Click "+ New Trip" in the sidebar
3. **Add Items**: Select a trip and start adding items
4. **Check Off Items**: Click checkboxes as you shop
5. **View History**: Access all previous trips from the sidebar

## Security

- Row Level Security (RLS) ensures users can only access their own data
- Google OAuth for secure authentication
- Environment variables for sensitive credentials
- HTTPS in production recommended

## Troubleshooting

### Google Sign-In Not Working
- Verify Google OAuth credentials are correct in Supabase
- Check that redirect URIs match exactly
- Ensure Google+ API is enabled in Google Cloud Console

### Database Errors
- Verify schema.sql was run successfully
- Check that RLS policies are enabled
- Ensure user is authenticated before querying

### Items Not Syncing
- Check browser console for errors
- Verify Socket.IO connection is established
- Ensure user is authenticated with Socket.IO

## Production Deployment

1. Set up environment variables on your hosting platform
2. Update Google OAuth redirect URIs to include production URL
3. Update Supabase allowed origins to include production URL
4. Use HTTPS in production
5. Consider adding rate limiting and monitoring

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Hosting**: Can be deployed to Heroku, Vercel, Railway, etc.
