import express from "express";
import {
  signup,
  verifyEmail,
  resendVerificationOTP,
  login,
  refreshToken,
  deactivateAccount,
  reactivateAccount,
  logout,
} from "../controllers/auth.controller.js";
import {
  validateSignup,
  validateRequest,
  validateLogin,
} from "../middleware/validation.middleware.js";
import {
  authLimiter,
  otpLimiter,
} from "../middleware/rateLimiter.middleware.js";
import {
  checkLoginAttempts,
  handleFailedLogin,
  resetLoginAttempts,
} from "../middleware/loginAttempt.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", authLimiter, validateSignup, validateRequest, signup);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user's email with OTP
 * @access  Public
 */
router.post("/verify-email", authLimiter, otpLimiter, verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification OTP
 * @access  Public
 */
router.post("/resend-verification", otpLimiter, resendVerificationOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  authLimiter,
  validateLogin,
  validateRequest,
  checkLoginAttempts,
  handleFailedLogin,
  resetLoginAttempts,
  login
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Get new access token using refresh token
 * @access  Public
 */
router.post("/refresh-token", refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, logout);

/**
 * @route   GET /api/auth/verify-auth
 * @desc    Logout user
 * @access  Private
 */

router.get("/verify-auth", authenticate, (req, res) => {
  res.status(200).json({ message: "User is authenticated", success: true });
});

/**
 * @route   POST /api/auth/deactivate
 * @desc    Deactivate user account
 * @access  Private
 */
router.post("/deactivate", authenticate, deactivateAccount);

/**
 * @route   POST /api/auth/reactivate
 * @desc    Reactivate user account
 * @access  Public
 */
router.post("/reactivate", reactivateAccount);

export default router;
