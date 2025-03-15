import bcrypt from "bcryptjs";
import User from "@/models/user.model.js";
import dbConnect from "@/lib/utils/db.js";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/utils/EmailVerification.js";
import jwt from "jsonwebtoken";

// Register User Controller
export const registerUser = async (req) => {
  try {
    await dbConnect(); // Connect to MongoDB

    const { name, email, password, role } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
      subscriptionStatus: "none",
      isEmailVerified: false,
    });

    await newUser.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(email);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Success response
    return Response.json({ message: "User registered successfully. Please check your email to verify your account." }, { status: 201 });

  } catch (error) {
    console.error("Error in user registration:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
};


export const loginUser = async (req) => {
  try {
    await dbConnect(); // Connect to MongoDB

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return Response.json({ message: "Please verify your email before logging in" }, { status: 403 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
};

