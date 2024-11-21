/* Controller function for the /demo route that handles retrieving
  metrics from the MongoDB database
  and sending them to the frontend
*/
import MetricsDemo from '../models/metricsDemo.js'; 

export const getDemoMetrics = async (req, res) => {
  try {
    // Query the MetricsDemo collection in MongoDB
    const metricsData = await MetricsDemo.find(); 
    res.json(metricsData); // Send the data as a JSON response
  } catch (error) {
    console.error('Error fetching metrics data:', error.message);
    res.status(500).json({ message: 'Error fetching data' }); 
  }
};
