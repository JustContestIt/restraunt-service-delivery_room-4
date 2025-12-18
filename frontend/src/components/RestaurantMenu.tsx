import { Restaurant } from '../types';
import { MenuItemCard } from './MenuItemCard';
import { useCart } from '../hooks/useCart';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantMenu = ({ restaurant, onBack }: RestaurantMenuProps) => {
  const { addToCart } = useCart();

  // Group menu items by category
  const groupedMenu = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menu>);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back to Restaurants</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-64">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-2">{restaurant.description}</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="text-yellow-400">⭐</span>
                <span>{restaurant.rating}</span>
              </span>
              <span className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{restaurant.deliveryTime}</span>
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {restaurant.cuisine}
              </span>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(groupedMenu).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={() => addToCart(item, restaurant)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
