import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

export const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
          {item.category}
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
