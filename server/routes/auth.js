import express from 'express';
import { handleOAuthCallback } from '../controllers/authController.js';

const router = express.Router();

// Route for initiating the OAuth flow


// This acts as the redirect URI. When using a redirectURI with BUNGIE, the connetion MUST BE SECURE.
// For this we make use of ngrok for our URLS.
router.get('/callback', handleOAuthCallback);

export default router
  