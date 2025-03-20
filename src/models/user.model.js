import mongoose from "mongoose";
import { nanoid } from "nanoid";
const userSchema = new mongoose.Schema(
  {
    u_id: {
      type: String,
      required: true,
      unique: true,
      default: ()=> nanoid(10),
    },
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
  },
  { timestamps: true } 
);

// Export User Model
export default mongoose.models.User || mongoose.model("User", userSchema);
