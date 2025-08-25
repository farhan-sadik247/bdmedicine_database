import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

export async function GET() {
  try {
    await dbConnect();

    // Get unique categories
    const categories = await Medicine.distinct('category_name');
    
    // Get unique manufacturers
    const manufacturers = await Medicine.distinct('manufacturer_name');

    // Get price range
    const priceStats = await Medicine.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    return NextResponse.json({
      categories: categories.sort(),
      manufacturers: manufacturers.sort(),
      priceRange: priceStats[0] || { minPrice: 0, maxPrice: 1000, avgPrice: 0 }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
