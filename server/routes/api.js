import express from "express";
import { getMetricsWithProgress } from "../controllers/apiController.js"; 
import app from '../app.js';

console.log("Redis client test 1:", app.client);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log("Redis client test 2:", app.client);

    const membershipType = await app.client.get("membershipType");
    const membershipId = await app.client.get("membershipId");
    const accessToken = await app.client.get("accessToken");


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
