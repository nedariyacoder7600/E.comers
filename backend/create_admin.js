import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    
    const email = 'nedariyacoder7600@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`User ${email} promoted to admin.`);
    } else {
      user = new User({
        name: 'Aabid Admin',
        email: email,
        password: 'admin', // Default password
        role: 'admin'
      });
      await user.save();
      console.log(`Admin user ${email} created with default password 'admin'.`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
