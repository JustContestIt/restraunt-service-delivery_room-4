import { useState } from 'react';
import { Header } from './components/Header';
import { CuisineFilter } from './components/CuisineFilter';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantMenu } from './components/RestaurantMenu';
import { Cart } from './components/Cart';
import { AIChatbot } from './components/AIChatbot';
import { CartProvider } from './hooks/useCart';
import { restaurants } from './data/restaurants';
import { Restaurant, CuisineType } from './types';

function AppContent() {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | 'All'>('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {selectedRestaurant ? (
        <RestaurantMenu
          restaurant={selectedRestaurant}
          onBack={() => setSelectedRestaurant(null)}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Discover Delicious Food
            </h2>
            <p className="text-gray-600">
              Browse restaurants and order your favorite meals
            </p>
          </div>

          <CuisineFilter
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
          />

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCuisine === 'All'
                ? 'All Restaurants'
                : `${selectedCuisine} Restaurants`}
            </h3>
            <p className="text-gray-600">
              {filteredRestaurants.length} restaurant
              {filteredRestaurants.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => setSelectedRestaurant(restaurant)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">
                No restaurants found for this cuisine
              </p>
              <button
                onClick={() => setSelectedCuisine('All')}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                View all restaurants
              </button>
            </div>
          )}
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIChatbot />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
