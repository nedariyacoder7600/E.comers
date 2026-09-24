import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    
    const user = await User.findOne({ email: 'admin@hookah.com' });
    console.log('User found:', user !== null);
    
    if (user) {
      console.log('Role:', user.role);
      const isMatch = await user.matchPassword('admin123');
      console.log('Password match:', isMatch);
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testLogin();
