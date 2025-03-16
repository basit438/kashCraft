import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
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
    gstinNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    businessNature: {
      type: String,
      required: true,
      trim: true,
      enum: ["Retail", "Wholesale", "Manufacturing", "Other"],
    },
    businessAddress: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isBusinessVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "seller",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
