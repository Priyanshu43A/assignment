import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const amazonAccountSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  marketplaceIds: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      code: String,
      expires: Date,
      attempts: {
        type: Number,
        default: 0,
      },
    },
    passwordResetOTP: {
      code: String,
      expires: Date,
      attempts: {
        type: Number,
        default: 0,
      },
    },
    accessToken: String,
    refreshToken: String,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    isLocked: {
      type: Boolean,
      default: false,
    },
    amazonAccounts: [amazonAccountSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ accessToken: 1 });
userSchema.index({ refreshToken: 1 });
userSchema.index({ "amazonAccounts.accessToken": 1 });
userSchema.index({ "amazonAccounts.refreshToken": 1 });
userSchema.index({ "amazonAccounts.marketplaceIds": 1 });

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate 6-digit OTP
userSchema.methods.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Method to generate email verification OTP
userSchema.methods.generateVerificationOTP = function () {
  const otp = this.generateOTP();

  this.verificationOTP = {
    code: otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };

  return otp;
};

// Method to verify email OTP
userSchema.methods.verifyEmailOTP = function (otp) {
  if (!this.verificationOTP || !this.verificationOTP.code) {
    return { valid: false, message: "No OTP generated" };
  }

  if (this.verificationOTP.attempts >= 3) {
    return {
      valid: false,
      message: "Too many attempts. Please request a new OTP",
    };
  }

  if (Date.now() > this.verificationOTP.expires) {
    return { valid: false, message: "OTP has expired" };
  }

  this.verificationOTP.attempts += 1;

  if (this.verificationOTP.code !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  this.isEmailVerified = true;
  this.verificationOTP = undefined;
  return { valid: true, message: "Email verified successfully" };
};

// Method to generate password reset OTP
userSchema.methods.generatePasswordResetOTP = function () {
  const otp = this.generateOTP();

  this.passwordResetOTP = {
    code: otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };

  return otp;
};

// Method to verify password reset OTP
userSchema.methods.verifyPasswordResetOTP = function (otp) {
  if (!this.passwordResetOTP || !this.passwordResetOTP.code) {
    return { valid: false, message: "No OTP generated" };
  }

  if (this.passwordResetOTP.attempts >= 3) {
    return {
      valid: false,
      message: "Too many attempts. Please request a new OTP",
    };
  }

  if (Date.now() > this.passwordResetOTP.expires) {
    return { valid: false, message: "OTP has expired" };
  }

  this.passwordResetOTP.attempts += 1;

  if (this.passwordResetOTP.code !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  this.passwordResetOTP = undefined;
  return { valid: true, message: "OTP verified successfully" };
};

// Method to add Amazon account
userSchema.methods.addAmazonAccount = function (accountData) {
  this.amazonAccounts.push(accountData);
  return this.save();
};

// Method to remove Amazon account
userSchema.methods.removeAmazonAccount = function (marketplaceId) {
  this.amazonAccounts = this.amazonAccounts.filter(
    (account) => !account.marketplaceIds.includes(marketplaceId)
  );
  return this.save();
};

// Method to update Amazon account
userSchema.methods.updateAmazonAccount = function (marketplaceId, updateData) {
  const accountIndex = this.amazonAccounts.findIndex((account) =>
    account.marketplaceIds.includes(marketplaceId)
  );

  if (accountIndex === -1) {
    throw new Error("Amazon account not found");
  }

  this.amazonAccounts[accountIndex] = {
    ...this.amazonAccounts[accountIndex],
    ...updateData,
    marketplaceIds: this.amazonAccounts[accountIndex].marketplaceIds,
  };

  return this.save();
};

// Method to increment login attempts and handle account locking
userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;

  // Lock account after 5 failed attempts
  if (this.loginAttempts >= 5) {
    this.isLocked = true;
    // Lock for 30 minutes
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  await this.save();
  return this;
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
  if (!this.isLocked) return false;

  if (this.lockUntil && new Date() > this.lockUntil) {
    // Reset if lock has expired
    this.isLocked = false;
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.save();
    return false;
  }

  return true;
};

// Method to check if user can login
userSchema.methods.canLogin = function () {
  return this.isActive && !this.isAccountLocked();
};

// Pre-save middleware to ensure loginAttempts is a number
userSchema.pre("save", function (next) {
  if (this.isModified("loginAttempts")) {
    this.loginAttempts = Number(this.loginAttempts) || 0;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
