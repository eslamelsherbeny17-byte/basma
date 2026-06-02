import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findByIdAndDelete(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Account deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
