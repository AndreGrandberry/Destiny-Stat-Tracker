import express from "express";
import { getMetricsWithProgress } from "../controllers/apiController.js"; 
import { client } from '../app.js';

console.log("Redis client test 1:", client);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log("Redis client test 2:", client);

    const membershipType = await client.get("membershipType");
    const membershipId = await client.get("membershipId");
    const accessToken = await client.get("accessToken");


    if (!membershipType || !membershipId || !accessToken) {
        return res.status(400).json({ error: "Missing OAuth data" });
    }

    // Call the function to get metrics with progress
    const metricsWithProgress = await getMetricsWithProgress(membershipType, membershipId, accessToken);

    // Send the data back to the frontend
    res.status(200).json(metricsWithProgress);
  } catch (error) {
    console.error("Error in /api/metrics route:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router
