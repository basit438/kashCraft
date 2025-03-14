import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "expired"],
      default: "none",
    },
  },
  { timestamps: true }
);

// Export User Model
export default mongoose.models.User || mongoose.model("User", userSchema);
