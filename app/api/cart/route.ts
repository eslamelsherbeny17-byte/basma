import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Cart from '@/lib/models/Cart';
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

    let cart = await Cart.findOne({ user: decoded.userId }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: decoded.userId, items: [], totalPrice: 0 });
      await cart.save();
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error('Cart fetch error:', error);
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
    const { productId, quantity } = body;

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      cart = new Cart({ user: decoded.userId, items: [] });
    }

    const existingItem = cart.items.find((item: any) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountPrice || product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    return NextResponse.json(
      {
        message: 'Item added to cart',
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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
    const { productId, quantity } = body;

    let cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
    } else {
      const item = cart.items.find((item: any) => item.product.toString() === productId);
      if (item) {
        item.quantity = quantity;
      }
    }

    await cart.save();
    await cart.populate('items.product');

    return NextResponse.json(
      {
        message: 'Cart updated',
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
