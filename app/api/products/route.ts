import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { getTokenFromRequest, verifyToken } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const sort = url.searchParams.get('sort') || '-createdAt';

    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleAr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    const products = await Product.find(query)
      .populate('category')
      .populate('brand')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json(
      {
        data: products,
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
    console.error('Products list error:', error);
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

    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const titleAr = formData.get('titleAr') as string || title;
    const description = formData.get('description') as string;
    const descriptionAr = formData.get('descriptionAr') as string || description;
    const price = parseFloat(formData.get('price') as string);
    const priceAfterDiscount = formData.get('priceAfterDiscount') 
      ? parseFloat(formData.get('priceAfterDiscount') as string) 
      : undefined;
    const imageCover = formData.get('imageCover') as File;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    
    // Get colors and sizes arrays
    const colors = formData.getAll('colors[]') as string[];
    const sizes = formData.getAll('sizes[]') as string[];
    const imagesFiles = formData.getAll('images') as File[];

    // TODO: Upload imageCover to Cloudinary and get URL
    let imageCoverUrl = '';
    if (imageCover) {
      // await uploadToCloudinary(imageCover)
      imageCoverUrl = '/placeholder.jpg'; // Placeholder for now
    }

    // TODO: Upload additional images to Cloudinary
    const imageUrls: string[] = [];
    // for (const img of imagesFiles) {
    //   const url = await uploadToCloudinary(img);
    //   imageUrls.push(url);
    // }

    const product = new Product({
      title,
      titleAr,
      description,
      descriptionAr,
      price,
      priceAfterDiscount,
      imageCover: imageCoverUrl,
      images: imageUrls,
      colors,
      sizes,
      category,
      brand,
      quantity,
      sold: 0,
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });

    await product.save();
    await product.populate('category');
    await product.populate('brand');

    return NextResponse.json(
      {
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
