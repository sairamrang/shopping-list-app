// Supabase configuration from config.js
const SUPABASE_URL = window.APP_CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.APP_CONFIG.SUPABASE_ANON_KEY;

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Socket.IO connection
const socket = io();

// App state
let currentUser = null;
let currentTrip = null;
let shoppingItems = [];
let allTrips = [];

// Category icons
const categoryIcons = {
  'produce': '🥬',
  'meat & seafood': '🥩',
  'deli & prepared foods': '🥓',
  'dairy & eggs': '🥛',
  'frozen foods': '🧊',
  'bakery': '🍞',
  'pantry & canned goods': '🥫',
  'oils & condiments': '🫒',
  'spices & baking': '🌶️',
  'breakfast & cereal': '🥣',
  'snacks': '🍿',
  'beverages': '🥤',
  'household & cleaning': '🧹',
  'personal care': '🧴',
  'baby & kids': '👶',
  'pet supplies': '🐾',
  'others': '📦'
};

// Category display order
const categoryOrder = [
  'produce',
  'meat & seafood',
  'deli & prepared foods',
  'dairy & eggs',
  'frozen foods',
  'bakery',
  'pantry & canned goods',
  'oils & condiments',
  'spices & baking',
  'breakfast & cereal',
  'snacks',
  'beverages',
  'household & cleaning',
  'personal care',
  'baby & kids',
  'pet supplies',
  'others'
];

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailEl = document.getElementById('userEmail');
const newTripBtn = document.getElementById('newTripBtn');
const newTripModal = document.getElementById('newTripModal');
const newTripForm = document.getElementById('newTripForm');
const cancelTripBtn = document.getElementById('cancelTripBtn');
const tripNameInput = document.getElementById('tripNameInput');
const tripDateInput = document.getElementById('tripDateInput');
const tripsListEl = document.getElementById('tripsList');
const noTripSelected = document.getElementById('noTripSelected');
const tripContent = document.getElementById('tripContent');
const tripNameEl = document.getElementById('tripName');
const tripDateEl = document.getElementById('tripDate');
const itemInput = document.getElementById('itemInput');
const quantityInput = document.getElementById('quantityInput');
const addBtn = document.getElementById('addBtn');
const categoriesContainer = document.getElementById('categoriesContainer');
const totalItemsSpan = document.getElementById('totalItems');
const purchasedItemsSpan = document.getElementById('purchasedItems');

// Initialize app
async function init() {
  // Check for existing session
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    handleAuthentication(session);
  }

  // Listen for auth state changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      handleAuthentication(session);
    } else if (event === 'SIGNED_OUT') {
      handleSignOut();
    }
  });
}

// Google Login
googleLoginBtn.addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    console.error('Login error:', error);
    alert('Failed to sign in with Google');
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut({ scope: 'global' });
  // Force clear local storage
  localStorage.clear();
  sessionStorage.clear();
});

// Handle successful authentication
async function handleAuthentication(session) {
  currentUser = session.user;

  // Show main app, hide login
  loginScreen.style.display = 'none';
  mainApp.style.display = 'block';

  // Display user info
  userEmailEl.textContent = currentUser.email;

  // Authenticate with Socket.IO
  socket.emit('authenticate', session.access_token);

  // Don't load trips here - wait for 'authenticated' event from server
}

// Handle sign out
function handleSignOut() {
  currentUser = null;
  currentTrip = null;
  shoppingItems = [];
  allTrips = [];

  loginScreen.style.display = 'flex';
  mainApp.style.display = 'none';

  socket.disconnect();
  socket.connect();
}

// Socket.IO event listeners
socket.on('authenticated', (data) => {
  console.log('Socket authenticated:', data);
  // Now that socket is authenticated, load trips
  loadTrips();
});

socket.on('authError', (message) => {
  console.error('Socket auth error:', message);
  alert('Authentication error. Please try logging in again.');
});

socket.on('tripsList', (trips) => {
  allTrips = trips;
  renderTripsList();
});

socket.on('tripCreated', (trip) => {
  allTrips.unshift(trip);
  renderTripsList();
  closeNewTripModal();
});

socket.on('currentTrip', (trip) => {
  currentTrip = trip;
  showTripContent();
});

socket.on('tripItems', (items) => {
  shoppingItems = items;
  renderItems();
  updateStats();
});

socket.on('itemAdded', (item) => {
  // Only add if it belongs to current trip
  if (currentTrip && item.trip_id === currentTrip.id) {
    shoppingItems.push(item);
    renderItems();
    updateStats();
  }
});

socket.on('itemUpdated', (updatedItem) => {
  const index = shoppingItems.findIndex(i => i.id === updatedItem.id);
  if (index !== -1) {
    shoppingItems[index] = updatedItem;
    renderItems();
    updateStats();
  }
});

socket.on('itemDeleted', (itemId) => {
  shoppingItems = shoppingItems.filter(i => i.id !== itemId);
  renderItems();
  updateStats();
});

socket.on('tripDeleted', (tripId) => {
  allTrips = allTrips.filter(t => t.id !== tripId);
  renderTripsList();

  // If the deleted trip was currently selected, clear the view
  if (currentTrip && currentTrip.id === tripId) {
    currentTrip = null;
    shoppingItems = [];
    tripContent.style.display = 'none';
    noTripSelected.style.display = 'flex';
  }
});

socket.on('error', (message) => {
  console.error('Socket error:', message);
  alert(message);
});

// Load trips
function loadTrips() {
  socket.emit('getTrips');
}

// Render trips list
function renderTripsList() {
  tripsListEl.innerHTML = '';

  if (allTrips.length === 0) {
    tripsListEl.innerHTML = '<div class="empty-trips">No trips yet. Create your first trip!</div>';
    return;
  }

  allTrips.forEach(trip => {
    const tripEl = document.createElement('div');
    tripEl.className = 'trip-item';
    if (currentTrip && trip.id === currentTrip.id) {
      tripEl.classList.add('active');
    }

    const tripDate = new Date(trip.trip_date);
    const formattedDate = tripDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    tripEl.innerHTML = `
      <div class="trip-item-content">
        <div class="trip-item-name">${escapeHtml(trip.trip_name)}</div>
        <div class="trip-item-date">${formattedDate}</div>
      </div>
      <button class="trip-delete-btn" onclick="deleteTrip('${trip.id}', event)">×</button>
    `;

    tripEl.querySelector('.trip-item-content').addEventListener('click', () => {
      loadTrip(trip.id);
    });

    tripsListEl.appendChild(tripEl);
  });
}

// Load a specific trip
function loadTrip(tripId) {
  socket.emit('loadTrip', tripId);
}

// Show trip content
function showTripContent() {
  noTripSelected.style.display = 'none';
  tripContent.style.display = 'block';

  tripNameEl.textContent = currentTrip.trip_name;

  const tripDate = new Date(currentTrip.trip_date);
  const formattedDate = tripDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  tripDateEl.textContent = formattedDate;

  renderTripsList(); // Update active state
}

// New trip modal
newTripBtn.addEventListener('click', () => {
  openNewTripModal();
});

cancelTripBtn.addEventListener('click', () => {
  closeNewTripModal();
});

function openNewTripModal() {
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  tripDateInput.value = today;
  tripNameInput.value = '';

  newTripModal.style.display = 'flex';
  tripNameInput.focus();
}

function closeNewTripModal() {
  newTripModal.style.display = 'none';
}

newTripForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const tripName = tripNameInput.value.trim();
  const tripDate = tripDateInput.value;

  if (tripName && tripDate) {
    socket.emit('createTrip', { tripName, tripDate });
  }
});

// Add item
function addItem() {
  if (!currentTrip) {
    alert('Please select or create a trip first');
    return;
  }

  const itemName = itemInput.value.trim();
  const quantity = parseInt(quantityInput.value) || 1;

  if (itemName) {
    socket.emit('addItem', { tripId: currentTrip.id, itemName, quantity });
    itemInput.value = '';
    quantityInput.value = 1;
    itemInput.focus();
  }
}

addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addItem();
  }
});

// Toggle purchased status
function togglePurchased(itemId) {
  socket.emit('togglePurchased', itemId);
}

// Delete item
function deleteItem(itemId) {
  socket.emit('deleteItem', itemId);
}

// Edit quantity inline
function editQuantity(itemId, currentQuantity) {
  const newQuantity = prompt('Enter new quantity:', currentQuantity);
  if (newQuantity !== null && newQuantity.trim() !== '') {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      socket.emit('updateQuantity', { itemId, quantity });
    } else {
      alert('Please enter a valid number greater than 0');
    }
  }
}

// Delete trip
function deleteTrip(tripId, event) {
  event.stopPropagation(); // Prevent triggering the trip click

  if (confirm('Are you sure you want to delete this trip? All items will be deleted.')) {
    socket.emit('deleteTrip', tripId);
  }
}

// Render all items grouped by category
function renderItems() {
  categoriesContainer.innerHTML = '';

  // Group items by category
  const itemsByCategory = {};
  categoryOrder.forEach(cat => {
    itemsByCategory[cat] = [];
  });

  shoppingItems.forEach(item => {
    if (itemsByCategory[item.category]) {
      itemsByCategory[item.category].push(item);
    } else {
      itemsByCategory['others'].push(item);
    }
  });

  // Render each category
  categoryOrder.forEach(category => {
    const items = itemsByCategory[category];

    // Only show category if it has items
    if (items.length > 0) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';
      categoryDiv.setAttribute('data-category', category);

      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.innerHTML = `
        <span class="category-icon">${categoryIcons[category]}</span>
        <span>${category} (${items.length})</span>
      `;

      const itemsList = document.createElement('div');
      itemsList.className = 'items-list';

      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${item.purchased ? 'purchased' : ''}`;
        itemDiv.innerHTML = `
          <input type="checkbox" ${item.purchased ? 'checked' : ''} onchange="togglePurchased('${item.id}')" />
          <span class="item-name">${escapeHtml(item.name)}</span>
          <span class="item-quantity" onclick="editQuantity('${item.id}', ${item.quantity})">(${item.quantity})</span>
          <button class="delete-btn" onclick="deleteItem('${item.id}')">×</button>
        `;
        itemsList.appendChild(itemDiv);
      });

      categoryDiv.appendChild(categoryHeader);
      categoryDiv.appendChild(itemsList);
      categoriesContainer.appendChild(categoryDiv);
    }
  });

  // Show message if no items
  if (shoppingItems.length === 0) {
    categoriesContainer.innerHTML = '<div class="empty-category">No items yet. Add your first item above!</div>';
  }
}

// Update statistics
function updateStats() {
  const total = shoppingItems.length;
  const purchased = shoppingItems.filter(i => i.purchased).length;

  totalItemsSpan.textContent = `${total} item${total !== 1 ? 's' : ''}`;
  purchasedItemsSpan.textContent = `${purchased} purchased`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available
window.togglePurchased = togglePurchased;
window.deleteItem = deleteItem;
window.deleteTrip = deleteTrip;
window.editQuantity = editQuantity;

// Initialize app
init();
