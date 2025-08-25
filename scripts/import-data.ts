import fs from 'fs';
import csv from 'csv-parser';
import dbConnect from '../src/lib/mongodb';
import Medicine from '../src/models/Medicine';

async function importData() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Medicine.deleteMany({});
    console.log('Cleared existing data');

    const medicines: any[] = [];
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
