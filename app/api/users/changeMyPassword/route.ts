import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken, generateToken } from '@/lib/middleware';

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const newToken = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Password updated successfully',
        token: newToken,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          avatar: user.avatar || '',
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
