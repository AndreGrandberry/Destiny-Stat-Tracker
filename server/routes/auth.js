import express from 'express';
import { handleOAuthCallback } from '../controllers/authController.js';

const router = express.Router();

// Route for initiating the OAuth flow


// This acts as the redirect URI. When using a redirectURI with BUNGIE, the connetion MUST BE SECURE.
router.get('/callback', (req, res, next) => handleOAuthCallback(req, res, next));

export default router
  