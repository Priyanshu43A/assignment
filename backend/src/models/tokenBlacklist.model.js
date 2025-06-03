import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["access", "refresh"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic cleanup of expired tokens
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

export default TokenBlacklist;
