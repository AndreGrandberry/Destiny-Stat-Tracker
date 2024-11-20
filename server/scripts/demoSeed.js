import mongoose from 'mongoose';
import MetricsDemo from '../models/metricsDemo.js'; // Import your MetricsDemo model
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env'});
// Sample data to insert
const sampleData = [
  {
    displayName: 'Demo User 1',
    stats: [
      { name: 'Kills', description: 'Total number of kills in the game', progress: 2000 },
      { name: 'Assists', description: 'Total number of assists', progress: 1500 },
      { name: 'Wins', description: 'Total number of wins', progress: 300 },
      { name: 'Losses', description: 'Total number of losses', progress: 100 },
    ],
  },
  {
    displayName: 'Demo User 2',
    stats: [
      { name: 'Kills', description: 'Total number of kills in the game', progress: 1800 },
      { name: 'Assists', description: 'Total number of assists', progress: 1200 },
      { name: 'Wins', description: 'Total number of wins', progress: 250 },
      { name: 'Losses', description: 'Total number of losses', progress: 80 },
    ],
  },
  {
    displayName: 'Demo User 3',
    stats: [
      { name: 'Kills', description: 'Total number of kills in the game', progress: 2200 },
      { name: 'Assists', description: 'Total number of assists', progress: 1700 },
      { name: 'Wins', description: 'Total number of wins', progress: 350 },
      { name: 'Losses', description: 'Total number of losses', progress: 90 },
    ],
  },
];
console.log()
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Clear existing data (optional, if you want to reset the collection each time)
    await MetricsDemo.deleteMany({});

    // Insert the sample data into the MetricsDemo collection
    await MetricsDemo.insertMany(sampleData);

    console.log('Sample data seeded successfully!');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    mongoose.disconnect();
  });
