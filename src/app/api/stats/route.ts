import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

export async function GET() {
  try {
    await dbConnect();

    // Get total medicines count
    const totalMedicines = await Medicine.countDocuments();

    // Get top categories
    const topCategories = await Medicine.aggregate([
      {
        $group: {
          _id: '$category_name',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get top manufacturers
    const topManufacturers = await Medicine.aggregate([
      {
        $group: {
          _id: '$manufacturer_name',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get price distribution
    const priceRanges = await Medicine.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 10, 25, 50, 100, 250, 500, 1000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    return NextResponse.json({
      totalMedicines,
      topCategories,
      topManufacturers,
      priceRanges
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
