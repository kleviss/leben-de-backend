const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI + 'quizdb');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Connection details:', {
        uri: process.env.MONGODB_URI.replace(/\/\/.*@/, '//****:****@'), // Hide credentials
        error: error.message,
      });
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
