import MetricsDemo from '../models/metricsDemo.js'; 

// Controller function to get demo metrics data
export const getDemoMetrics = async (req, res) => {
  try {
    // Query the MetricsDemo collection in MongoDB
    const metricsData = await MetricsDemo.find(); 
    res.json(metricsData); // Send the data as a JSON response
  } catch (error) {
    console.error('Error fetching metrics data:', error.message);
    res.status(500).json({ message: 'Error fetching data' }); // Handle errors
  }
};
