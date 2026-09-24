import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const createNewAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    console.log('Connected to DB');

    const email = 'admin@hookah.com';
    const password = 'admin123';

    // Check if admin exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      console.log(`Admin already exists: ${email} / ${password}`);
      process.exit();
    }

    const admin = new User({
      name: 'System Admin',
      email: email,
      password: password, 
      role: 'admin'
    });

    await admin.save();
    console.log('New Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createNewAdmin();
