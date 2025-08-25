const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

// Medicine Schema
const MedicineSchema = new mongoose.Schema({
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

const Medicine = mongoose.model('Medicine', MedicineSchema);

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Medicine.deleteMany({});
    console.log('Cleared existing data');

    const medicines = [];
    const csvPath = '../all_medicine_and_drug_price_data(20k)_Bangladesh.csv';

    // Read CSV file
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        medicines.push({
          medicine_name: row.medicine_name,
          category_name: row.category_name,
          slug: row.slug,
          generic_name: row.generic_name,
          strength: row.strength || '',
          manufacturer_name: row.manufacturer_name,
          unit: row.unit,
          unit_size: parseInt(row.unit_size) || 1,
          price: parseFloat(row.price) || 0
        });
      })
      .on('end', async () => {
        console.log(`Processing ${medicines.length} medicines...`);
        
        // Insert in batches to avoid memory issues
        const batchSize = 1000;
        for (let i = 0; i < medicines.length; i += batchSize) {
          const batch = medicines.slice(i, i + batchSize);
          await Medicine.insertMany(batch);
          console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(medicines.length / batchSize)}`);
        }

        console.log('Data import completed successfully!');
        await mongoose.connection.close();
        process.exit(0);
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        process.exit(1);
      });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

importData();
