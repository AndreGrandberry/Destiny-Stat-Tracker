/* The progress field is empty in the db
  this is due to conflicts with how Bungie
  stores metrics in their API.
  So we retrieve the progress for the metrics separately
*/

import axios from "axios";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const API_ROOT_PATH = 'https://www.bungie.net/Platform';
const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;

export const fetchAllMetricsProgress = async (membershipType, membershipId, accessToken) => {
    try {
      // Fetch all metrics progress in one request
      
      const endpoint = `${API_ROOT_PATH}/Destiny2/${membershipType}/Profile/${membershipId}/?components=Metrics`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-API-KEY': BUNGIE_API_KEY,
        },
      });
  
      if (response.data.ErrorCode !== 1 || response.data.ErrorStatus !== 'Success') {
        throw new Error('Error fetching metrics progress: ' + response.data.Message);
      }
  
      // Extract and return progress data
      const metricsData = response.data.Response.metrics.data.metrics;
      return metricsData; // This is a map of metricHash to progress
    } catch (error) {
      console.error('Error fetching all metrics progress:', error.message);
      throw error;
    }
  };
