import dotenv from 'dotenv';
dotenv.config();

console.log('--- Environment Check ---');
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'LOADED' : 'MISSING'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'LOADED' : 'MISSING'}`);
console.log(`RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'MISSING'}`);
console.log(`RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? 'LOADED (masked)' : 'MISSING'}`);
process.exit(0);
