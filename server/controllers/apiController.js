// Controller function for the /api route

import Metric from "../models/metric.js";
import { fetchAllMetricsProgress } from "./progressController.js";



export const getMetricsWithProgress = async (membershipType, membershipId, accessToken) => {
  try {
    // Fetch metrics data from the database
    const metricsData = await Metric.findOne().maxTimeMS(20000);
    if (!metricsData) {
      throw new Error("No metrics data found in the database.");
    }

    const { categories } = metricsData.toObject();

    // Fetch all progress from Bungie API
    const progressData = await fetchAllMetricsProgress(membershipType, membershipId, accessToken);

    // Add progress to the metrics dynamically
    const updatedCategories = categories.map((category) => ({
      categoryName: category.categoryName,
      metrics: category.metrics.map((met) => {
        // Get the metricHash from the database for the metric
        const metricHash = met.metricHash;

        // Retrieve the progress data using the metricHash from progressData
        const progress = progressData[metricHash]?.objectiveProgress?.progress || 0;  // Default to 0 if progress is not available
        
        // Return the updated metric with the progress
        return {
          ...met,
          progress: progress, // Update the progress field
        };
      }),
    }));

    return updatedCategories; // Ready for the frontend
  } catch (error) {
    console.error("Error fetching metrics with progress:", error.message);
    throw error;
  }
};