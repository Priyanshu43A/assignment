import express from "express";
import amazonAuthController from "../controllers/amazonAuthController.js";

const router = express.Router();

// Get authorization URL
router.get("/auth-url", amazonAuthController.getAuthUrl);

// OAuth callback endpoint
router.get("/callback", amazonAuthController.handleCallback);

// Refresh token endpoint
router.post("/refresh-token/:sellerId", amazonAuthController.refreshToken);

export default router;
