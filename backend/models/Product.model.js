import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
  img2: { type: String },
  img3: { type: String },
  img4: { type: String },
  colors: [{
    colorName: { type: String },
    imageUrl: { type: String }
  }],
  rating: { type: Number, default: 5 },
  description: { type: String },
  isFeatured: { type: Boolean, default: false },
  originalPrice: { type: String },
  inStock: { type: Boolean, default: true },
  stockLabel: { type: String, default: 'Out of Stock' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
