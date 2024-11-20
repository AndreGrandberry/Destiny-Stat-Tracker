import MetricsDemo from '../models/metricsDemo.js'; // Import the MetricsDemo model

// Controller function to get demo metrics data
export const getDemoMetrics = async (req, res) => {
  try {
    // Query the MetricsDemo collection in MongoDB
    const metricsData = await MetricsDemo.find(); // You can add filters if needed
    res.json(metricsData); // Send the data as a JSON response
  } catch (error) {
    console.error('Error fetching metrics data:', error.message);
    res.status(500).json({ message: 'Error fetching data' }); // Handle errors
  }
};
