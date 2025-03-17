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
    
    await dbConnect(); // Ensure database connection
   
    // Parse the request body
   
    const body = await req.json();

    const {
      email,
      password,
      businessName,
      registrationNumber,
      businessNature,
      businessAddress,
      contactNumber,
      panNumber,
      aadharNumber,
      artisan,
    } = body;

    // Validate input: All required fields must be provided
   
    if (
      !email ||
      !password ||
      !businessName ||
      !registrationNumber ||
      !businessNature ||
      !businessAddress ||
      !contactNumber ||
      !panNumber ||
      !aadharNumber
    ) {
     
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }
  
    // Check if a seller with this email already exists
   
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
     
      return new Response(
        JSON.stringify({ message: "Seller already exists" }),
        { status: 400 }
      );
    }
    

    // Hash the password before saving
   
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new seller document
   
    const newSeller = new Seller({
      email,
      password: hashedPassword,
      businessName,
      registrationNumber,
      businessNature,
      businessAddress,
      contactNumber,
      panNumber,
      aadharNumber,
      isBusinessVerified: false,
      subscription: "none",
      artisan: artisan || "",
    });
    

    // Save the seller to the database
   
    await newSeller.save();
    

    // Return success response
    
    return new Response(
      JSON.stringify({ message: "Seller registered successfully. PLease wait for admin approval to login into your seller account" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering seller:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};

// login Seller Controller

export const sellerLogin = async (req) => {
  try {
    await dbConnect(); // Ensure database connection

    // Parse the request body
    const body = await req.json();
    const { email, password } = body;

    // Validate input: Email and password must be provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Check if business is verified
    if (!seller.isBusinessVerified) {
      return new Response(
        JSON.stringify({ message: "Your account verification is pending. Please wait for admin approval." }),
        { status: 403 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response with token
    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        seller: {
          id: seller._id,
          email: seller.email,
          businessName: seller.businessName,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in seller:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};



  

