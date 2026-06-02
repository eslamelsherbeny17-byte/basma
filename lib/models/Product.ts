import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  titleAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  quantity: number;
  sold: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
    },
    titleAr: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    priceAfterDiscount: Number,
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    colors: [String],
    sizes: [String],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamps: true }
);

// Generate slug from title - supports Arabic characters
productSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
