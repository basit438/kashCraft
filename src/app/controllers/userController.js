import bcrypt from "bcryptjs";
import User from "@/models/user.model.js";
import dbConnect from "@/lib/utils/db.js";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/utils/EmailVerification.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import Seller from "@/models/seller.model";

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
      u_id: nanoid(10),
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

// Login User Controller
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


// registerSeller Controller

export const registerSeller = async (req) => {
  try {
    await dbConnect();

    // Parse the request body
    const {
      email,
      password,
      businessName,
      gstinNumber,
      businessNature,
      businessAddress,
      contactNumber,
    } = await req.json();

    // Validate required fields
    if (
      !email ||
      !password ||
      !businessName ||
      !gstinNumber ||
      !businessNature ||
      !businessAddress ||
      !contactNumber
    ) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if a seller with the provided email already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      // If updating an existing seller, check if GSTIN is changing
      if (existingSeller.gstinNumber !== gstinNumber) {
        const sellerWithGSTIN = await Seller.findOne({ gstinNumber });
        if (
          sellerWithGSTIN &&
          sellerWithGSTIN._id.toString() !== existingSeller._id.toString()
        ) {
          return Response.json(
            { message: "GSTIN Number already in use" },
            { status: 400 }
          );
        }
      }
      // Check if contact number is changing
      if (existingSeller.contactNumber !== contactNumber) {
        const sellerWithContact = await Seller.findOne({ contactNumber });
        if (
          sellerWithContact &&
          sellerWithContact._id.toString() !== existingSeller._id.toString()
        ) {
          return Response.json(
            { message: "Contact Number already in use" },
            { status: 400 }
          );
        }
      }
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the existing seller record
      const updatedSeller = await Seller.findByIdAndUpdate(
        existingSeller._id,
        {
          email,
          password: hashedPassword,
          businessName,
          gstinNumber,
          businessNature,
          businessAddress,
          contactNumber,
          role: "seller", // ensure role is set to seller
          isBusinessVerified: false,
        },
        { new: true, runValidators: true }
      );
      return Response.json(
        { message: "Seller updated successfully", seller: updatedSeller },
        { status: 200 }
      );
    } else {
      // For a new seller, check if GSTIN is already registered
      const sellerWithGSTIN = await Seller.findOne({ gstinNumber });
      if (sellerWithGSTIN) {
        return Response.json(
          { message: "GSTIN Number already in use" },
          { status: 400 }
        );
      }
      // For a new seller, check if Contact Number is already registered
      const sellerWithContact = await Seller.findOne({ contactNumber });
      if (sellerWithContact) {
        return Response.json(
          { message: "Contact Number already in use" },
          { status: 400 }
        );
      }

      // Hash the password before creating a new seller
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new seller document
      const newSeller = new Seller({
        email,
        password: hashedPassword,
        businessName,
        gstinNumber,
        businessNature,
        businessAddress,
        contactNumber,
        role: "seller", // explicitly set role to seller
        isBusinessVerified: false,
      });
      await newSeller.save();

      return Response.json(
        { message: "Seller registered successfully", seller: newSeller },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering seller:", error);
    return Response.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};





  

