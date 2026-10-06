const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your_shopping_app';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500 // Don't block app start if local mongo isn't up
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB] Local MongoDB connection unavailable (${err.message}).`);
    console.log(`[Storage] Seamlessly activating high-performance JSON datastore fallback.`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
