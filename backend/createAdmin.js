import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    console.log('Connected to DB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@luxe.com' });
    if (adminExists) {
      console.log('Admin already exists: admin@luxe.com / admin123');
      process.exit();
    }

    const admin = new User({
      name: 'Super Admin',
      email: 'admin@luxe.com',
      password: 'admin', // This corresponds to password, before hashing in pre-save.
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@luxe.com');
    console.log('Password: admin');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
