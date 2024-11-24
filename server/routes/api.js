/* Route for retrieving progress data data from Bungie API,
  combining with metrics from MongoDB,
  and sending as JSON response to frontend.
  
*/
import express from "express";
import { getMetricsWithProgress } from "../controllers/apiController.js"; 



const router = express.Router();

router.get('/', async (req, res) => {
  try {
   
    const membershipType = req.session.membershipType;
    const membershipId = req.session.membershipId;
    const accessToken = req.session.accessToken;


    if (!membershipType || !membershipId || !accessToken) {
        return res.status(400).json({ error: "Missing OAuth data" });
    }

    // Call the function to get metrics with progress
    const metricsWithProgress = await getMetricsWithProgress(membershipType, membershipId, accessToken);

    // Send the data back to the frontend
    console.log(metricsWithProgress);
    res.status(200).json(metricsWithProgress);
  } catch (error) {
    console.error("Error in /api/ route:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router
