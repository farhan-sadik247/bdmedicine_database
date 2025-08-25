import { IMedicine } from '@/models/Medicine';
import { X, Pill, Building2, Tag, DollarSign, Package, Calendar, Hash } from 'lucide-react';

interface MedicineModalProps {
  medicine: IMedicine;
  isOpen: boolean;
  onClose: () => void;
}

export default function MedicineModal({ medicine, isOpen, onClose }: MedicineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Pill className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Medicine Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Medicine Name and Generic */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {medicine.medicine_name}
            </h3>
            <p className="text-lg text-blue-600 font-semibold mb-2">
              {medicine.generic_name}
            </p>
            {medicine.strength && (
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {medicine.strength}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-2" />
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  ৳{medicine.price.toFixed(2)}
                </div>
                <div className="text-sm text-green-700">
                  per {medicine.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="text-base text-gray-900 mt-1">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    {medicine.category_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Manufacturer */}
            <div className="flex items-start space-x-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-gray-500">Manufacturer</div>
                <div className="text-base text-gray-900 mt-1">
                  {medicine.manufacturer_name}
                </div>
              </div>
            </div>

            {/* Unit Information */}
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-gray-500">Unit Details</div>
                <div className="text-base text-gray-900 mt-1">
                  {medicine.unit_size} {medicine.unit}
                </div>
              </div>
            </div>

            {/* Slug */}
            <div className="flex items-start space-x-3">
              <Hash className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-gray-500">Product Code</div>
                <div className="text-sm text-gray-900 mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                  {medicine.slug}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Medicine:</span>
                <span className="ml-2 text-gray-600">{medicine.medicine_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Generic:</span>
                <span className="ml-2 text-gray-600">{medicine.generic_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{medicine.category_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Price/Unit:</span>
                <span className="ml-2 text-gray-600">৳{medicine.price.toFixed(2)} per {medicine.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
