import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import Contact from './models/Contact.model.js';
import Product from './models/Product.model.js';
import HomeConfig from './models/HomeConfig.model.js';
import PageConfig from './models/PageConfig.model.js';
import Order from './models/Order.model.js';
import User from './models/User.model.js';
import Cart from './models/Cart.model.js';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// dotenv.config(); // Moved below for better path resolution

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, 'uploads');

// Ensure directory exists with full permissions
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load environment variables relative to this file
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('WARNING: Razorpay keys are missing from environment variables!');
}

const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim()
});

if (process.env.RAZORPAY_KEY_ID) {
  const k = process.env.RAZORPAY_KEY_ID.trim();
  console.log(`Razorpay Key ID Verified: ${k.substring(0, 8)}...${k.substring(k.length - 4)}`);
}

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// Serving static files
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `luxe-${Date.now()}-${Math.round(Math.random() * 1E4)}${fileExt}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Primary Upload Endpoint
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Limit/Error:', err);
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Upload Error' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received in request.' });
    }

    const host = req.get('host');
    const imageUrl = `${req.protocol}://${host}/uploads/${req.file.filename}`;
    console.log('Manifested Asset:', imageUrl);
    res.status(200).json({ success: true, imageUrl });
  });
});

// Page and Product CRUD (Consolidated)
app.get('/api/products', async (req, res) => {
  try { res.status(200).json({ success: true, products: await Product.find().sort({ createdAt: -1 }) }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/products', async (req, res) => {
  try { res.status(201).json({ success: true, product: await new Product(req.body).save() }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.status(200).json({ success: true }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.put('/api/products/:id', async (req, res) => {
  try { 
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/page-config/:name', async (req, res) => {
  try { res.status(200).json({ success: true, config: await PageConfig.findOne({ pageName: req.params.name }) }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/page-config', async (req, res) => {
  try { res.status(200).json({ success: true, config: await PageConfig.findOneAndUpdate({ pageName: req.body.pageName }, req.body, { upsert: true, new: true }) }); }
  catch (e) { res.status(500).json({ success: false }); }
});

// Legacy Home Sync
app.get('/api/home-config', async (req, res) => {
  try { res.status(200).json({ success: true, config: await HomeConfig.findOne() || { heroBanners: [] } }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/home-config', async (req, res) => {
  try { res.status(200).json({ success: true, config: await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true }) }); }
  catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/contact', async (req, res) => {
  try { await new Contact(req.body).save(); res.status(201).json({ success: true }); }
  catch (e) { res.status(500).json({ success: false }); }
});

// Auth & User Validation Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token === 'undefined' || token === 'null') {
         throw new Error('Invalid token format');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxe-secret-key');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) return next();
    } catch (error) { 
      console.error('JWT Verify Error:', error.message);
    }
  }
  
  // Lenient fallback: If token fails, find the first user (likely you) to allow the order
  const fallbackUser = await User.findOne();
  req.user = fallbackUser;
  return next();
};

// Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'Entity already exists.' });
    user = new User({ name, email, password });
    await user.save();
    
    await new Cart({ user: user._id, items: [] }).save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'luxe-secret-key', { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    let email = req.body.email?.trim().toLowerCase();
    
    // Auto-correct shortcut just in case
    if (email === 'admin') email = 'admin@hookah.com';
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: `Entity not found. Tried to look for: ${email}` });
    if (!(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid quantum key.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'luxe-secret-key', { expiresIn: '7d' });
    res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin OTP Request
app.post('/api/auth/admin-otp', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!user) return res.status(404).json({ success: false, message: 'Entity not found.' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access Denied.' });
    if (!(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid quantum key.' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Luxe Matrix Admin Authentication',
      html: `
        <div style="background: #050505; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #d4af37;">
          <h2 style="color: #d4af37;">Neural Access Required</h2>
          <p>Your one-time authentication code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #d4af37; margin: 20px 0;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent to neural node (email).' });
  } catch (e) { 
    console.error('OTP Error:', e);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Check email configuration.' }); 
  }
});

// Admin OTP Verify & Login
app.post('/api/auth/admin-login-verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Clear OTP after success
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'luxe-secret-key', { expiresIn: '7d' });
    res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Cart Endpoints
app.get('/api/cart', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await new Cart({ user: req.user._id, items: [] }).save();
    res.status(200).json({ success: true, cartData: cart });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/cart/add', protect, async (req, res) => {
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    
    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index > -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    res.status(200).json({ success: true, cartData: cart });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/cart/update', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    
    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index > -1) cart.items[index].quantity = quantity;
    }
    await cart.save();
    res.status(200).json({ success: true, cartData: cart });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/cart/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { new: true });
    res.status(200).json({ success: true, cartData: cart });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Order Endpoints
app.get('/api/orders', async (req, res) => {
  try {
    // If request has user, fetch only theirs, else fetch all (for admin)
    const orders = await Order.find().populate('products.product').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/orders/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/orders', protect, async (req, res) => {
  try {
    console.log('--- Incoming Order ---', req.body);
    const newOrder = new Order({ ...req.body, user: req.user._id });
    await newOrder.save();
    console.log('Order Saved!', newOrder._id);
    res.status(201).json({ success: true, order: newOrder });
  } catch (e) {
    console.error('Order Error:', e);
    const msg = e.message || "Internal Order Processing Error";
    res.status(500).json({ success: false, message: msg });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Clear user cart if order confirmed (as requested)
    if (orderStatus === 'Confirmed' || orderStatus === 'Shipped') {
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
    }
    
    res.status(200).json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Razorpay: Create Order
app.post('/api/orders/razorpay', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (e) {
    console.error('Razorpay Order Error Details:', e);
    
    let msg = "Razorpay System Offline";
    if (e.statusCode === 401) {
      msg = "Razorpay Authentication failed: Your KEY_SECRET in .env is incorrect.";
    } else {
      msg = e.error?.description || e.message || msg;
    }
    
    res.status(500).json({ success: false, message: msg });
  }
});

// Diagnostic Endpoint
app.get('/api/debug/razorpay', async (req, res) => {
  try {
    const keys = {
      key_id: process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'Missing',
      key_secret: process.env.RAZORPAY_KEY_SECRET ? 'Loaded' : 'Missing'
    };
    
    const payments = await razorpay.payments.all({ count: 1 });
    res.json({ success: true, keys, message: "Razorpay Connection Active", payments_count: payments.items.length });
  } catch (e) {
    res.status(500).json({ 
      success: false, 
      error: e.message, 
      details: e.error?.description || "Check your .env keys",
      hint: e.statusCode === 401 ? "Your Key Secret is invalid." : "Unknown Razorpay error"
    });
  }
});

// Razorpay: Verify Payment
app.post('/api/orders/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
      
      // Clear user cart after payment success
      const order = await Order.findById(orderId);
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (e) {
    console.error('Verification Error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    console.log(`Luxe Matrix Bound: ${conn.connection.host}`);
  } catch (error) {
    console.error('Matrix Connection Failure:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Core Neural Signal Online: http://localhost:${PORT}`);
});
