import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
          <span className="text-yellow-400 text-lg">⭐</span>
          <span className="font-semibold text-gray-800">{restaurant.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
            {restaurant.cuisine}
          </span>
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            {restaurant.deliveryTime}
          </div>
        </div>
      </div>
    </div>
  );
};
