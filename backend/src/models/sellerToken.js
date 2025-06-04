import mongoose from "mongoose";

const sellerTokenSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
    unique: true,
  },
  marketplaceId: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  tokenExpiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
sellerTokenSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("SellerToken", sellerTokenSchema);
