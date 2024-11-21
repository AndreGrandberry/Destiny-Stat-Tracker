// File for seeding the db

import mongoose from 'mongoose';
import Metric from '../models/metric.js';
import { organizeMetricsByGroups } from './metricsController.js';
import dotenv from 'dotenv';



dotenv.config({ path: '../../.env'});

console.log('Bungie API Key: ', process.env.BUNGIE_API_KEY);


// Seed Function to Populate MongoDB
async function seedDatabase() {
    const presentationNodeHashes = [ // An array of all the category for easy organization
            { presentationNodeHash: '3844527950', categoryName: "Seasons" },
            { presentationNodeHash: '2875839731', categoryName: "Account" },
            { presentationNodeHash: '565440981', categoryName: "Crucible" },
            { presentationNodeHash: '3707324621', categoryName: "Destination" },
            { presentationNodeHash: '4193411410', categoryName: "Gambit" },
            { presentationNodeHash: '926976517', categoryName: "Raids" },
            { presentationNodeHash: '2755216039', categoryName:"Strikes" },
            { presentationNodeHash: '3722177789', categoryName:"Trials of Osiris" }
        ]

    const uri = process.env.MONGODB_URI;
    mongoose.set('strictQuery', false);
    await mongoose
        .connect(uri)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

    try {
        // Organize metrics data
        const categories = await organizeMetricsByGroups(presentationNodeHashes);
        
        // Insert data into the collection
        const transformedData = Object.entries(categories).map(([categoryName, metrics]) => ({
            categoryName,
            metrics,
          }));

        // Insert the data into MongoDB
        await Metric.create({ categories: transformedData });
        console.log('Database seeded successfully with nested metrics by category');
        
        console.log('Metrics successfully inserted into MongoDB!');
        } catch (error) {
        console.error('Error seeding database:', error);
        } finally {
        // Close the database connection
        mongoose.connection.close();
        }

}

seedDatabase();

