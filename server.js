require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Category keywords for auto-categorization (organized by store aisles)
const categoryKeywords = {
  'produce': ['apple', 'banana', 'orange', 'grape', 'strawberry', 'mango', 'pear', 'peach', 'plum', 'cherry', 'watermelon', 'melon', 'kiwi', 'pineapple', 'blueberry', 'raspberry', 'lemon', 'lime', 'avocado', 'coconut',
              'carrot', 'potato', 'tomato', 'onion', 'garlic', 'lettuce', 'cabbage', 'broccoli', 'cauliflower', 'spinach', 'cucumber', 'pepper', 'bell pepper', 'celery', 'zucchini', 'eggplant', 'radish', 'beetroot', 'corn', 'peas', 'mushroom', 'asparagus', 'kale', 'arugula', 'squash'],

  'meat & seafood': ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'steak', 'ground beef', 'ground turkey', 'ribs', 'brisket', 'roast',
                     'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'shrimp', 'prawns', 'lobster', 'crab', 'scallops', 'mussels', 'oyster', 'clams'],

  'deli & prepared foods': ['bacon', 'sausage', 'ham', 'salami', 'pepperoni', 'deli meat', 'turkey breast', 'roast beef', 'prosciutto', 'chorizo', 'hot dog', 'bratwurst', 'rotisserie chicken', 'prepared meals'],

  'dairy & eggs': ['milk', 'whole milk', 'skim milk', 'almond milk', 'oat milk', 'soy milk', 'heavy cream', 'half and half', 'whipping cream',
                   'cheese', 'cheddar', 'mozzarella', 'parmesan', 'swiss', 'feta', 'gouda', 'brie', 'cream cheese', 'cottage cheese', 'ricotta',
                   'butter', 'margarine', 'yogurt', 'greek yogurt', 'sour cream', 'eggs', 'egg whites'],

  'frozen foods': ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen fruit', 'frozen dinner', 'frozen fries', 'frozen chicken', 'popsicle', 'frozen waffles', 'frozen burrito', 'frozen fish', 'gelato', 'sorbet', 'frozen yogurt'],

  'bakery': ['bread', 'white bread', 'wheat bread', 'sourdough', 'rye bread', 'baguette', 'croissant', 'bagel', 'english muffin', 'muffin', 'donut', 'danish', 'cake', 'cookies', 'roll', 'buns', 'hamburger buns', 'hot dog buns', 'tortilla', 'pita', 'naan'],

  'pantry & canned goods': ['rice', 'brown rice', 'white rice', 'pasta', 'spaghetti', 'penne', 'macaroni', 'noodles', 'ramen',
                            'flour', 'all-purpose flour', 'wheat flour', 'sugar', 'brown sugar', 'powdered sugar',
                            'canned beans', 'black beans', 'kidney beans', 'chickpeas', 'beans', 'lentils',
                            'canned tomato', 'tomato sauce', 'tomato paste', 'diced tomatoes', 'crushed tomatoes',
                            'canned soup', 'chicken broth', 'beef broth', 'vegetable broth', 'stock',
                            'tuna can', 'canned tuna', 'canned chicken', 'canned corn', 'canned peas'],

  'oils & condiments': ['olive oil', 'vegetable oil', 'canola oil', 'coconut oil', 'cooking spray', 'oil',
                        'ketchup', 'mustard', 'mayo', 'mayonnaise', 'relish', 'bbq sauce', 'hot sauce', 'sriracha', 'soy sauce', 'worcestershire', 'teriyaki',
                        'vinegar', 'balsamic vinegar', 'apple cider vinegar', 'white vinegar', 'rice vinegar',
                        'salad dressing', 'ranch', 'italian dressing', 'caesar dressing',
                        'pasta sauce', 'marinara', 'alfredo', 'pesto', 'salsa', 'guacamole', 'hummus'],

  'spices & baking': ['salt', 'sea salt', 'kosher salt', 'pepper', 'black pepper', 'cumin', 'turmeric', 'paprika', 'cayenne', 'chili powder',
                      'cinnamon', 'oregano', 'basil', 'thyme', 'rosemary', 'parsley', 'cilantro', 'dill', 'sage', 'bay leaves',
                      'coriander', 'cardamom', 'clove', 'nutmeg', 'ginger', 'garlic powder', 'onion powder', 'italian seasoning', 'taco seasoning',
                      'baking powder', 'baking soda', 'yeast', 'vanilla extract', 'cocoa powder', 'chocolate chips', 'sprinkles'],

  'breakfast & cereal': ['cereal', 'corn flakes', 'cheerios', 'granola', 'oatmeal', 'oats', 'instant oats', 'pancake mix', 'waffle mix', 'syrup', 'maple syrup', 'honey', 'jam', 'jelly', 'peanut butter', 'almond butter', 'nutella'],

  'snacks': ['chips', 'potato chips', 'tortilla chips', 'pretzels', 'popcorn', 'crackers', 'goldfish', 'cheez-its',
             'nuts', 'almonds', 'cashews', 'peanuts', 'trail mix', 'granola bar', 'protein bar', 'candy', 'chocolate', 'gummy bears', 'cookies'],

  'beverages': ['water', 'sparkling water', 'soda', 'coke', 'pepsi', 'sprite', 'juice', 'orange juice', 'apple juice', 'cranberry juice',
                'coffee', 'tea', 'green tea', 'iced tea', 'energy drink', 'sports drink', 'gatorade', 'beer', 'wine', 'seltzer'],

  'household & cleaning': ['paper towels', 'toilet paper', 'tissues', 'napkins', 'trash bags', 'ziplock bags', 'aluminum foil', 'plastic wrap', 'parchment paper',
                          'dish soap', 'laundry detergent', 'fabric softener', 'bleach', 'disinfectant', 'wipes', 'sponge', 'cleaning spray', 'glass cleaner'],

  'personal care': ['shampoo', 'conditioner', 'body wash', 'soap', 'toothpaste', 'toothbrush', 'mouthwash', 'floss', 'deodorant', 'lotion', 'sunscreen', 'razors', 'shaving cream'],

  'baby & kids': ['diapers', 'baby wipes', 'baby food', 'baby formula', 'baby powder', 'pacifier'],

  'pet supplies': ['dog food', 'cat food', 'pet food', 'dog treats', 'cat treats', 'cat litter', 'pet treats']
};

// Auto-categorize item based on name
function categorizeItem(itemName) {
  const lowerName = itemName.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }

  return 'others';
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let userId = null;
  let userSupabase = null; // User-specific Supabase client

  // Authenticate user
  socket.on('authenticate', async (accessToken) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        socket.emit('authError', 'Authentication failed');
        return;
      }

      userId = user.id;

      // Create a user-specific Supabase client with their access token
      userSupabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        }
      );

      socket.emit('authenticated', { userId: user.id, email: user.email });
      console.log('User authenticated:', user.email);
    } catch (error) {
      console.error('Auth error:', error);
      socket.emit('authError', 'Authentication failed');
    }
  });

  // Get all trips for the user
  socket.on('getTrips', async () => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      const { data: trips, error } = await userSupabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      socket.emit('tripsList', trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      socket.emit('error', 'Failed to fetch trips');
    }
  });

  // Create a new trip
  socket.on('createTrip', async ({ tripName, tripDate }) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      const { data: trip, error } = await userSupabase
        .from('trips')
        .insert([
          {
            user_id: userId,
            trip_name: tripName,
            trip_date: tripDate || new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      socket.emit('tripCreated', trip);
      socket.emit('currentTrip', trip);
    } catch (error) {
      console.error('Error creating trip:', error);
      socket.emit('error', 'Failed to create trip');
    }
  });

  // Load a specific trip
  socket.on('loadTrip', async (tripId) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      // Get trip details
      const { data: trip, error: tripError } = await userSupabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Get items for this trip
      const { data: items, error: itemsError } = await userSupabase
        .from('shopping_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      socket.emit('currentTrip', trip);
      socket.emit('tripItems', items);
    } catch (error) {
      console.error('Error loading trip:', error);
      socket.emit('error', 'Failed to load trip');
    }
  });

  // Add item to current trip
  socket.on('addItem', async ({ tripId, itemName, quantity }) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      const category = categorizeItem(itemName);

      const { data: item, error } = await userSupabase
        .from('shopping_items')
        .insert([
          {
            trip_id: tripId,
            name: itemName,
            category: category,
            quantity: quantity || 1,
            purchased: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Broadcast to all clients viewing this trip
      io.emit('itemAdded', item);
    } catch (error) {
      console.error('Error adding item:', error);
      socket.emit('error', 'Failed to add item');
    }
  });

  // Toggle purchased status
  socket.on('togglePurchased', async (itemId) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      // Get current item
      const { data: currentItem, error: fetchError } = await userSupabase
        .from('shopping_items')
        .select('purchased')
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;

      // Update item
      const { data: item, error: updateError } = await userSupabase
        .from('shopping_items')
        .update({ purchased: !currentItem.purchased })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      io.emit('itemUpdated', item);
    } catch (error) {
      console.error('Error toggling purchased:', error);
      socket.emit('error', 'Failed to update item');
    }
  });

  // Delete item
  socket.on('deleteItem', async (itemId) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      const { error } = await userSupabase
        .from('shopping_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      io.emit('itemDeleted', itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      socket.emit('error', 'Failed to delete item');
    }
  });

  // Delete trip
  socket.on('deleteTrip', async (tripId) => {
    if (!userId || !userSupabase) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    try {
      // Delete trip (items will be cascade deleted due to foreign key)
      const { error } = await userSupabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      io.emit('tripDeleted', tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      socket.emit('error', 'Failed to delete trip');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
