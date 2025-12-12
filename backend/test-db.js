const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Force using Google DNS for resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGODB_URI;
console.log('Testing connection...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ Connected successfully!');
  process.exit(0);
})
.catch((err) => {
  console.log('❌ Connection failed:', err.message);
  process.exit(1);
});
