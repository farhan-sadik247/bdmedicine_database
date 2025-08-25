import { Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FiltersProps {
  filters: {
    category: string;
    manufacturer: string;
    minPrice: string;
    maxPrice: string;
  };
  onFiltersChange: (filters: {
    category: string;
    manufacturer: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

interface FilterData {
  categories: string[];
  manufacturers: string[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
}

export default function Filters({ filters, onFiltersChange, onClearFilters }: FiltersProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    manufacturers: [],
    priceRange: { minPrice: 0, maxPrice: 1000, avgPrice: 0 }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(data => setFilterData(data))
      .catch(console.error);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden mb-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </button>

      {/* Filters sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white rounded-lg shadow-sm border p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-900">All Categories</option>
              {filterData.categories.map(category => (
                <option key={category} value={category} className="text-gray-900">{category}</option>
              ))}
            </select>
          </div>

          {/* Manufacturer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer
            </label>
            <select
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-900">All Manufacturers</option>
              {filterData.manufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer} className="text-gray-900">{manufacturer}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (BDT)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Range: ৳{filterData.priceRange.minPrice.toFixed(2)} - ৳{filterData.priceRange.maxPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
