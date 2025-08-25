import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

interface FilterObject {
  $or?: Array<{ [key: string]: RegExp }>;
  category_name?: RegExp;
  manufacturer_name?: RegExp;
  price?: {
    $gte?: number;
    $lte?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const manufacturer = searchParams.get('manufacturer') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'medicine_name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build filter object
    const filter: FilterObject = {};

    // Text search - improved with regex for partial matching and priority ranking
    if (search) {
      const searchTerm = search.trim().toLowerCase();
      
      // Handle very short searches (1-2 characters) more carefully
      if (searchTerm.length <= 2) {
        const exactRegex = new RegExp(`^${searchTerm}`, 'i'); // Starts with for short terms
        const wordBoundaryRegex = new RegExp(`\\b${searchTerm}`, 'i'); // Word boundary
        
        filter.$or = [
          { medicine_name: exactRegex }, // Highest priority: starts with
          { generic_name: exactRegex },
          { manufacturer_name: exactRegex },
          { medicine_name: wordBoundaryRegex }, // Second: word boundary
          { generic_name: wordBoundaryRegex },
          { manufacturer_name: wordBoundaryRegex },
          { strength: wordBoundaryRegex }
        ];
      } else {
        // Split search term by spaces for multi-word search
        const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
        
        if (searchWords.length === 1) {
          // Single word search with priority ranking
          const word = searchWords[0];
          const exactRegex = new RegExp(`^${word}$`, 'i'); // Exact match
          const startRegex = new RegExp(`^${word}`, 'i'); // Starts with
          const wordBoundaryRegex = new RegExp(`\\b${word}`, 'i'); // Word boundary
          const containsRegex = new RegExp(word, 'i'); // Contains
          
          filter.$or = [
            // Priority 1: Exact matches (medicine name first)
            { medicine_name: exactRegex },
            { generic_name: exactRegex },
            { manufacturer_name: exactRegex },
            
            // Priority 2: Starts with matches (medicine name first)
            { medicine_name: startRegex },
            { generic_name: startRegex },
            { manufacturer_name: startRegex },
            
            // Priority 3: Word boundary matches (medicine name first)
            { medicine_name: wordBoundaryRegex },
            { generic_name: wordBoundaryRegex },
            { manufacturer_name: wordBoundaryRegex },
            { strength: wordBoundaryRegex },
            
            // Priority 4: Contains matches (medicine name first)
            { medicine_name: containsRegex },
            { generic_name: containsRegex },
            { manufacturer_name: containsRegex },
            { strength: containsRegex },
            { category_name: containsRegex }
          ];
        } else {
          // Multi-word search - prioritize medicine name, then generic, then manufacturer
          const orConditions = [];
          for (const word of searchWords) {
            const wordRegex = new RegExp(word, 'i');
            // Add in priority order
            orConditions.push(
              { medicine_name: wordRegex },
              { generic_name: wordRegex },
              { manufacturer_name: wordRegex },
              { strength: wordRegex },
              { category_name: wordRegex }
            );
          }
          filter.$or = orConditions;
        }
      }
    }

    // Category filter
    if (category) {
      filter.category_name = new RegExp(category, 'i');
    }

    // Manufacturer filter
    if (manufacturer) {
      filter.manufacturer_name = new RegExp(manufacturer, 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: { [key: string]: 1 | -1 } = {};
    
    // If searching, prioritize relevance, otherwise use requested sort
    if (search) {
      // When searching, prioritize by medicine name first for better relevance
      sort.medicine_name = 1;
      if (sortBy !== 'medicine_name') {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query with improved sorting for search results
    let medicines;
    let total;

    if (search) {
      // When searching, use multiple queries to get results in priority order
      const searchTerm = search.trim().toLowerCase();
      
      // Create separate queries for different priority levels
      const exactMedicineNameQuery = { 
        ...filter, 
        medicine_name: new RegExp(`^${searchTerm}$`, 'i') 
      };
      const exactGenericNameQuery = { 
        ...filter, 
        generic_name: new RegExp(`^${searchTerm}$`, 'i') 
      };
      const exactManufacturerQuery = { 
        ...filter, 
        manufacturer_name: new RegExp(`^${searchTerm}$`, 'i') 
      };
      
      // Get exact matches first
      const exactMedicineMatches = await Medicine.find(exactMedicineNameQuery).limit(limit).lean();
      const exactGenericMatches = await Medicine.find(exactGenericNameQuery).limit(limit - exactMedicineMatches.length).lean();
      const exactManufacturerMatches = await Medicine.find(exactManufacturerQuery).limit(limit - exactMedicineMatches.length - exactGenericMatches.length).lean();
      
      // Combine exact matches
      const exactMatches = [...exactMedicineMatches, ...exactGenericMatches, ...exactManufacturerMatches];
      
      // If we have enough results, use them
      if (exactMatches.length >= limit) {
        medicines = exactMatches.slice(0, limit);
      } else {
        // Get additional results using the original query, excluding exact matches
        const usedIds = exactMatches.map(m => m._id);
        const remainingFilter = { ...filter, _id: { $nin: usedIds } };
        const remainingMedicines = await Medicine.find(remainingFilter)
          .sort(sort)
          .limit(limit - exactMatches.length)
          .lean();
        
        medicines = [...exactMatches, ...remainingMedicines];
      }
      
      // Get total count for pagination
      total = await Medicine.countDocuments(filter);
    } else {
      // Regular query without search
      medicines = await Medicine.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      total = await Medicine.countDocuments(filter);
    }

    return NextResponse.json({
      medicines,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
