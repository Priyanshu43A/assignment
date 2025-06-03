import User from "../models/user.model.js";

export const checkLoginAttempts = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next();
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockTime = new Date(user.lockUntil).getTime();
      const currentTime = new Date().getTime();
      const remainingTime = Math.ceil((lockTime - currentTime) / (1000 * 60)); // in minutes

      return res.status(403).json({
        success: false,
        message: `Account is locked due to too many failed attempts. Please try again after ${remainingTime} minutes`,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Store user in request for later use
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// This middleware is no longer needed as we handle attempts in the controller
export const handleFailedLogin = async (req, res, next) => {
  next();
};

// This middleware is no longer needed as we handle reset in the controller
export const resetLoginAttempts = async (req, res, next) => {
  next();
};
