import mongoose from 'mongoose';

export interface IMedicine {
  _id?: string;
  medicine_name: string;
  category_name: string;
  slug: string;
  generic_name: string;
  strength: string;
  manufacturer_name: string;
  unit: string;
  unit_size: number;
  price: number;
}

const MedicineSchema = new mongoose.Schema<IMedicine>({
  medicine_name: {
    type: String,
    required: true,
    index: true
  },
  category_name: {
    type: String,
    required: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  generic_name: {
    type: String,
    required: true,
    index: true
  },
  strength: {
    type: String,
    required: false
  },
  manufacturer_name: {
    type: String,
    required: true,
    index: true
  },
  unit: {
    type: String,
    required: true
  },
  unit_size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
MedicineSchema.index({
  medicine_name: 'text',
  generic_name: 'text',
  manufacturer_name: 'text',
  category_name: 'text'
});

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);
