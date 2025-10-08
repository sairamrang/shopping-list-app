# Shopping List App

A real-time shopping list application that allows multiple users to add, delete, and mark items as purchased simultaneously. Items are automatically categorized (fruits, vegetables, dairy, spices, meat, bakery, pantry, others).

## Features

- ✅ Real-time synchronization between multiple devices
- 🏷️ Automatic categorization of items
- ☑️ Checkbox to mark items as purchased
- ➕ Add new items
- ❌ Delete items
- 📱 Mobile-friendly responsive design
- 🎨 Color-coded categories with icons

## Setup Instructions

1. **Fix npm permissions (if needed):**
   ```bash
   sudo chown -R 501:20 "/Users/sai.rangachari/.npm"
   ```

2. **Install dependencies:**
   ```bash
   cd shopping-list-app
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   - Go to `http://localhost:3000`
   - Open the same URL on multiple devices or browser tabs to test real-time sync

## How to Use

1. **Add items:** Type an item name (e.g., "apples", "milk", "bread") and click "Add Item"
2. **Auto-categorization:** Items are automatically sorted into categories based on their name
3. **Mark as purchased:** Check the checkbox next to an item when bought
4. **Delete items:** Click the "Delete" button to remove items
5. **Multi-user:** Both you and your spouse can use it simultaneously on different devices - changes sync instantly!

## Categories

- 🍎 **Fruits:** apples, bananas, oranges, etc.
- 🥕 **Vegetables:** carrots, potatoes, tomatoes, etc.
- 🥛 **Dairy:** milk, cheese, yogurt, eggs, etc.
- 🌶️ **Spices:** salt, pepper, cumin, etc.
- 🥩 **Meat:** chicken, beef, fish, etc.
- 🍞 **Bakery:** bread, bagels, croissants, etc.
- 🥫 **Pantry:** rice, pasta, flour, etc.
- 📦 **Others:** anything that doesn't fit above categories

## Technical Stack

- **Backend:** Node.js, Express, Socket.io
- **Frontend:** HTML, CSS, JavaScript
- **Real-time:** WebSocket connections via Socket.io

## Port

Default port is 3000. You can change it by setting the PORT environment variable:
```bash
PORT=8080 npm start
```
