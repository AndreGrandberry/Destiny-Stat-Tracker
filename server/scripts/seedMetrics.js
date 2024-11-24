import Metric from "../models/metric.js";
import mongoose from 'mongoose';
import { fetchPresentationNodeMetrics } from "./metricsController.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env'});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if the connection fails
});

// Function to seed the database with metricHash values based on Bungie API
// Function to seed the database with metricHash values based on Bungie API
const seedDatabaseWithMetricHashes = async () => {
    try {
      // Your defined presentationNodes, where each has a category name and associated NodeHash
      const presentationNodes = [
        { presentationNodeHash: '3844527950', categoryName: "Seasons" },
        { presentationNodeHash: '2875839731', categoryName: "Account" },
        { presentationNodeHash: '565440981', categoryName: "Crucible" },
        { presentationNodeHash: '3707324621', categoryName: "Destination" },
        { presentationNodeHash: '4193411410', categoryName: "Gambit" },
        { presentationNodeHash: '926976517', categoryName: "Raids" },
        { presentationNodeHash: '2755216039', categoryName: "Strikes" },
        { presentationNodeHash: '3722177789', categoryName: "Trials of Osiris" }
      ];
  
      let allMetrics = [];
  
      // Loop over the presentationNodes to retrieve the metricHashes from Bungie API
      for (const node of presentationNodes) {
        const nodeHash = node.presentationNodeHash;
        const nodeData = await fetchPresentationNodeMetrics(nodeHash); // Fetch metrics for each node from the Bungie API
  
        if (!nodeData || nodeData.length === 0) {
          console.error(`No metrics found for presentation node hash: ${nodeHash}`);
          continue; // Skip if no data is returned
        }
  
        for (const metric of nodeData) {
          allMetrics.push({
            categoryName: node.categoryName,
            metricHash: metric.metricHash
          });
        }
      }
  
      // Retrieve the Metric document from the database
      const metricDocument = await Metric.findOne(); // Fetch the first document in the collection
  
      if (!metricDocument) {
        throw new Error("No metric document found in the database.");
      }
  
      // Now, update the categories and their metrics with the correct metricHash values
      const updatedCategories = metricDocument.categories.map((category) => {
        const updatedMetrics = category.metrics.map((metric, index) => {
          // Directly assign the metricHash from the allMetrics array based on the index
          const metricData = allMetrics[index];
  
          if (!metricData) {
            console.log(`No metricHash found for category: ${category.categoryName} at index: ${index}`);
            return metric; // Return the original metric if no metricData is found
          }
  
          return {
            ...metric,
            metricHash: metricData.metricHash // Assign the metricHash from the Bungie data
          };
        });
  
        return {
          ...category,
          metrics: updatedMetrics
        };
      });
  
      // Save the updated categories with their metrics and metricHash values back to the database
      metricDocument.categories = updatedCategories;
      await metricDocument.save();
  
      console.log("Database successfully seeded with metricHash values.");
    } catch (error) {
      console.error("Error seeding the database:", error.message);
    } finally {
      mongoose.connection.close();
    }
  };

  // Call the function to seed the database
seedDatabaseWithMetricHashes();