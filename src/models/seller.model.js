import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    artisan: {
      type: String,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    businessNature: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: String,
      default: "none",
      enum: ["none", "active", "expired"],
    },
    isBusinessVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Use an existing model if it exists to prevent OverwriteModelError
const Seller = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
export default Seller;
