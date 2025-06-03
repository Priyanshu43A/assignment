import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import { sendVerificationEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    // Generate verification OTP
    const verificationOTP = user.generateVerificationOTP();

    // Save user
    await user.save();

    try {
      // Send verification email
      const { previewUrl } = await sendVerificationEmail(
        user.email,
        verificationOTP
      );

      // Return success response without sensitive data
      res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email.",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          ...(process.env.NODE_ENV === "development" && {
            emailPreviewUrl: previewUrl,
          }),
        },
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Delete the user if email sending fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? emailError.message
            : undefined,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error in user registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verificationResult = user.verifyEmailOTP(otp);
    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error in email verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const verificationOTP = user.generateVerificationOTP();
    await user.save();

    const { previewUrl } = await sendVerificationEmail(
      user.email,
      verificationOTP
    );

    res.json({
      success: true,
      message: "Verification OTP sent successfully",
      previewUrl,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error in sending verification OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      console.log("Failed login attempt:", user.loginAttempts);

      // Check if we should lock the account
      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        console.log("Account locked until:", user.lockUntil);
      }

      await user.save();

      if (user.isAccountLocked()) {
        return res.status(403).json({
          success: false,
          message: `Account is now locked due to too many failed attempts. Please try again after 30 minutes.`,
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = undefined;

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Update user's tokens and last login
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Return success response
    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Update user's access token
    user.accessToken = accessToken;
    await user.save();

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Error in refreshing token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = req.user;

    user.isActive = false;
    user.deactivatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Account deactivation error:", error);
    res.status(500).json({
      success: false,
      message: "Error in deactivating account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const reactivateAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account is already active",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.isActive = true;
    user.deactivatedAt = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Account reactivated successfully",
    });
  } catch (error) {
    console.error("Account reactivation error:", error);
    res.status(500).json({
      success: false,
      message: "Error in reactivating account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const user = req.user;

    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Access token and refresh token are required",
      });
    }

    // Decode tokens to get expiration
    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    if (!decodedAccess || !decodedRefresh) {
      return res.status(400).json({
        success: false,
        message: "Invalid tokens",
      });
    }

    // Add tokens to blacklist
    await Promise.all([
      TokenBlacklist.create({
        token: accessToken,
        type: "access",
        expiresAt: new Date(decodedAccess.exp * 1000),
        userId: user._id,
      }),
      TokenBlacklist.create({
        token: refreshToken,
        type: "refresh",
        expiresAt: new Date(decodedRefresh.exp * 1000),
        userId: user._id,
      }),
    ]);

    // Clear tokens from user document
    user.accessToken = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error in logout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
