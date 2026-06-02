import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    let query: any = {};

    if (code) {
      query.code = code;
    }

    const coupons = await Coupon.find(query);

    return NextResponse.json({ data: coupons }, { status: 200 });
  } catch (error) {
    console.error('Coupons fetch error:', error);
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
    const { code, discount, discountType, minAmount, maxUses, expiresAt } = body;

    const coupon = new Coupon({
      code,
      discount,
      discountType,
      minAmount,
      maxUses,
      expiresAt,
    });

    await coupon.save();

    return NextResponse.json(
      {
        message: 'Coupon created successfully',
        data: coupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Coupon creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
