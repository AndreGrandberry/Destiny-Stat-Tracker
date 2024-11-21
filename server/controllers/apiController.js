import Metric from "../models/metric.js";
import { fetchAllMetricsProgress } from "./progressController.js";
import { fetchPresentationNodeMetrics } from "../scripts/metricsController.js";


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

// Array to store the metric hashes
let metricHashes = [];

for (const node of presentationNodes) {
  const nodeHash = node.presentationNodeHash; // Take the NodeHash of the category
  const nodeData = await fetchPresentationNodeMetrics(nodeHash, accessToken);

  // Iterate through the metrics and store the metricHash in the array
  for (const metric of nodeData) {
    console.log(metric.metricHash);  // Log the metricHash to console
    metricHashes.push(metric.metricHash);  // Store the metricHash in the array
  }
}

// Now you can use the metricHashes array
console.log(metricHashes);  // Array of all metricHashes from all nodes


export const getMetricsWithProgress = async (membershipType, membershipId, accessToken) => {
  try {

    // Step 1: Fetch metrics data from the database
    const metricsData = await Metric.findOne().maxTimeMS(20000);
    if (!metricsData) {
      throw new Error("No metrics data found in the database.");
    }

    const { categories } = metricsData.toObject();

    // Step 2: Fetch all progress from Bungie API
    const progressData = await fetchAllMetricsProgress(membershipType, membershipId, accessToken);

    // Step 3: Add progress to the metrics dynamically
    const updatedCategories = categories.map((category) => ({
      categoryName: category.categoryName,
      metrics: category.metrics.map((met, index) => {
        // Get the metricHash from the metricHashes array by index
        const metricHash = metricHashes[index];  // Assuming each metric corresponds to one metricHash
    
        // Retrieve the progress data using the metricHash from progressData
        const progress = progressData[metricHash]?.objectiveProgress?.progress || 0;
    
        // Return the updated metric with progress
        return {
          ...met,
          progress: progress, // Update progress field
        };
      }),
    }));

    return updatedCategories; // Ready for the frontend
  } catch (error) {
    console.error("Error fetching metrics with progress:", error.message);
    throw error;
  }
};
