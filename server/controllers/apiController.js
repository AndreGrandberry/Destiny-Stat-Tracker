import Metric from "../models/metric.js";
import { fetchAllMetricsProgress } from "./progressController.js";

export const getMetricsWithProgress = async (membershipType, membershipId, accessToken) => {
  try {
    // Step 1: Fetch metrics data from the database
    const metricsData = await Metric.findOne();
    if (!metricsData) {
      throw new Error("No metrics data found in the database.");
    }

    const { categories } = metricsData.toObject();

    // Step 2: Fetch all progress from Bungie API
    const progressData = await fetchAllMetricsProgress(membershipType, membershipId, accessToken);

    // Step 3: Add progress to the metrics dynamically
    const updatedCategories = categories.map((category) => ({
      categoryName: category.categoryName,
      metrics: category.metrics.map((metric) => ({
        ...metric,
        progress: progressData[metric.metricHash]?.objectiveProgress?.progress || 0, // Default to 0 if progress not found
      })),
    }));

    return updatedCategories; // Ready for the frontend
  } catch (error) {
    console.error("Error fetching metrics with progress:", error.message);
    throw error;
  }
};
