import { CuisineType } from '../types';

const cuisines: CuisineType[] = [
  'Italian',
  'Chinese',
  'Japanese',
  'Mexican',
  'American',
  'Indian',
  'Thai',
  'French',
];

interface CuisineFilterProps {
  selectedCuisine: CuisineType | 'All';
  onSelectCuisine: (cuisine: CuisineType | 'All') => void;
}

export const CuisineFilter = ({
  selectedCuisine,
  onSelectCuisine,
}: CuisineFilterProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Cuisine Type</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCuisine('All')}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selectedCuisine === 'All'
              ? 'bg-primary-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Cuisines
        </button>
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => onSelectCuisine(cuisine)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCuisine === cuisine
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  );
};
