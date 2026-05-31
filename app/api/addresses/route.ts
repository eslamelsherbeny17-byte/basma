import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Address from '@/lib/models/Address';
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

    const addresses = await Address.find({ user: decoded.userId }).sort('-createdAt');

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error('Addresses fetch error:', error);
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

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { fullName, phone, address, city, postalCode, country, isDefault } = body;

    // If this is default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: decoded.userId }, { isDefault: false });
    }

    const newAddress = new Address({
      user: decoded.userId,
      fullName,
      phone,
      address,
      city,
      postalCode,
      country,
      isDefault: isDefault || false,
    });

    await newAddress.save();

    return NextResponse.json(
      {
        message: 'Address created successfully',
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Address creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
