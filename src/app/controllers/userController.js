import bcrypt from "bcryptjs";
import User from "@/models/user.model.js";
import dbConnect from "@/lib/utils/db.js";

// Register User Controller
export const registerUser = async (req) => {
  try {
    await dbConnect(); // Connect to MongoDB

    const { name, email, password, role } = await req.json();

    //  Validate input
    if (!name || !email || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
      subscriptionStatus:"none",
      isEmailVerified: false
    });

    await newUser.save();

    //  Success response
    return Response.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
};
