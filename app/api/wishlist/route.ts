import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Wishlist from '@/lib/models/Wishlist';
import Product from '@/lib/models/Product';
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

    let wishlist = await Wishlist.findOne({ user: decoded.userId }).populate('products');

    if (!wishlist) {
      wishlist = new Wishlist({ user: decoded.userId, products: [] });
      await wishlist.save();
    }

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
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
    const { productId } = body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ user: decoded.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: decoded.userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');

    return NextResponse.json(
      {
        message: 'Product added to wishlist',
        wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const productId = url.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user: decoded.userId });

    if (!wishlist) {
      return NextResponse.json({ message: 'Wishlist not found' }, { status: 404 });
    }

    wishlist.products = wishlist.products.filter((p: any) => p.toString() !== productId);

    await wishlist.save();
    await wishlist.populate('products');

    return NextResponse.json(
      {
        message: 'Product removed from wishlist',
        wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Wishlist delete error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
