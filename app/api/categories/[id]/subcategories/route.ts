import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Get all unique products in this category
    const products = await Product.find({ category: params.id })
      .select('title category subcategory')
      .lean();

    // Extract unique subcategories/types
    const subcategories = [...new Set(products.map((p: any) => p.subcategory).filter(Boolean))];

    return NextResponse.json(
      {
        data: subcategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subcategories error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
