'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import MedicineCard from '@/components/MedicineCard';
import Pagination from '@/components/Pagination';
import Loading from '@/components/Loading';
import Statistics from '@/components/Statistics';
import { IMedicine } from '@/models/Medicine';
import { ArrowUpDown, Grid3x3, List } from 'lucide-react';

interface PaginationData {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export default function Home() {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [filters, setFilters] = useState({
    category: '',
    manufacturer: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('medicine_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch medicines
  const fetchMedicines = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.category && { category: filters.category }),
        ...(filters.manufacturer && { manufacturer: filters.manufacturer }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/medicines?${params}`);
      const data = await response.json();

      setMedicines(data.medicines);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchMedicines(1);
  }, [debouncedSearch, filters, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchMedicines(page);
  };

  // Handle search
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  // Handle filters
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      category: '',
      manufacturer: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchValue={search} onSearchChange={handleSearchChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <Statistics />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Filters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with results count and sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoading ? 'Loading...' : `${pagination.total.toLocaleString()} Medicines Found`}
                </h2>
                {(debouncedSearch || Object.values(filters).some(f => f)) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {debouncedSearch && `Search: "${debouncedSearch}" `}
                    {filters.category && `Category: ${filters.category} `}
                    {filters.manufacturer && `Manufacturer: ${filters.manufacturer} `}
                    {(filters.minPrice || filters.maxPrice) && 
                      `Price: ৳${filters.minPrice || '0'} - ৳${filters.maxPrice || '∞'}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="medicine_name" className="text-gray-900">Name</option>
                    <option value="price" className="text-gray-900">Price</option>
                    <option value="category_name" className="text-gray-900">Category</option>
                    <option value="manufacturer_name" className="text-gray-900">Manufacturer</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <Loading />
            ) : medicines.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {medicines.map((medicine) => (
                    <MedicineCard key={medicine._id} medicine={medicine} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M15 11V9a6 6 0 00-12 0v2c0 .642.102 1.261.291 1.836" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
