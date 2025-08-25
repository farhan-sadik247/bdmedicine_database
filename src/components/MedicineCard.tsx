import { useState } from 'react';
import { IMedicine } from '@/models/Medicine';
import { Pill, Building2, Tag, DollarSign } from 'lucide-react';
import MedicineModal from './MedicineModal';

interface MedicineCardProps {
  medicine: IMedicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {medicine.medicine_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {medicine.generic_name}
          </p>
          {medicine.strength && (
            <p className="text-sm text-blue-600 font-medium">
              {medicine.strength}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center text-green-600 font-bold text-xl">
            <DollarSign className="h-5 w-5 mr-1" />
            ৳{medicine.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            per {medicine.unit}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Tag className="h-4 w-4 mr-2 text-gray-400" />
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {medicine.category_name}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
          <span>{medicine.manufacturer_name}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Pill className="h-4 w-4 mr-2 text-gray-400" />
            <span>Unit Size: {medicine.unit_size}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Slug: {medicine.slug}
          </span>
          <button 
            onClick={handleViewDetails}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      <MedicineModal 
        medicine={medicine}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
