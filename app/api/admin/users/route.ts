import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments();

    return NextResponse.json(
      {
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
