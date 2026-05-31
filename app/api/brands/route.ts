import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Brand from '@/lib/models/Brand';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const brands = await Brand.find({});

    return NextResponse.json({ brands }, { status: 200 });
  } catch (error) {
    console.error('Brands list error:', error);
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
    const { name, description, logo } = body;

    const brand = new Brand({
      name,
      description,
      logo,
    });

    await brand.save();

    return NextResponse.json(
      {
        message: 'Brand created successfully',
        brand,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Brand creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
