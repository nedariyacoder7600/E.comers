import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    
    const email = 'nedariyacoder7600@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.password = '123456';
      await user.save();
      console.log(`Password for ${email} reset to '123456'.`);
    } else {
      console.log('User not found.');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
