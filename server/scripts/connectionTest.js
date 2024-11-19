import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables

dotenv.config({ path: '../../.env'});

console.log('Bungie Api Key', process.env.BUNGIE_API_KEY);
const uri = process.env.MONGODB_CONNECTION_STRING;

if (!uri) {
  console.error('MongoDB connection string is undefined. Check your .env file.');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas', err));
