import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from './models/Contact.model.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hookah_db');
    console.log('--- Checking Recent Inquiries ---');
    
    const inquiries = await Contact.find().sort({ createdAt: -1 }).limit(5);
    
    if (inquiries.length === 0) {
      console.log('No inquiries found in the database.');
    } else {
      inquiries.forEach((item, index) => {
        console.log(`\n[Inquiry #${index + 1}]`);
        console.log(`Name: ${item.name}`);
        console.log(`Email: ${item.email}`);
        console.log(`Message: ${item.message}`);
        console.log(`Date: ${item.createdAt}`);
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

checkDatabase();
