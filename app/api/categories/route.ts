import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const categories = await Category.find({});

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Categories list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const { name, description, image } = body;

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();

    return NextResponse.json(
      {
        message: 'Category created successfully',
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Category creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
