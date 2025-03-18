import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../lib/utils/db.js";
import Admin from "../../models/admin.model.js";

// Admin Registration Controller
export const adminRegister = async (req) => {
  try {
    await dbConnect(); // Ensure database connection

    // Parse the request body
    const { name, email, contactNo, password } = await req.json();

    // Validate required fields
    if (!name || !email || !contactNo || !password) {
      return new Response(
        JSON.stringify({ message: "Name, email, contact number, and password are required" }),
        { status: 400 }
      );
    }

    // Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin with this email already exists" }),
        { status: 400 }
      );
    }

    // Create a new admin (password will be hashed via pre-save hook in the schema)
    const newAdmin = new Admin({ name, email, contactNo, password });
    await newAdmin.save();

    return new Response(
      JSON.stringify({ message: "Admin registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};

// Admin Login Controller
export const adminLogin = async (req) => {
  try {
    await dbConnect(); // Ensure database connection

    // Parse the request body
    const { email, password } = await req.json();

    // Validate input: Email and password are required
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    const now = Date.now();

    // Check if the account is locked (lockUntil is set in the future)
    if (admin.lockUntil && admin.lockUntil > now) {
      const remainingMinutes = Math.ceil((admin.lockUntil - now) / (1000 * 60));
      return new Response(
        JSON.stringify({
          message: `Your account is locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minutes.`,
        }),
        { status: 403 }
      );
    }

    // Check if the admin account is active
    if (!admin.isActive) {
      return new Response(
        JSON.stringify({ message: "Your account is disabled." }),
        { status: 403 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // If the last failed attempt was over 24 hours ago, reset the counter
      if (
        !admin.lastFailedAttempt ||
        now - new Date(admin.lastFailedAttempt).getTime() > 24 * 60 * 60 * 1000
      ) {
        admin.loginAttempts = 0;
      }
      admin.loginAttempts += 1;
      admin.lastFailedAttempt = new Date();

      // If there are 5 or more failed attempts within 24 hours, lock the account for 24 hours
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = now + 24 * 60 * 60 * 1000;
      }
      await admin.save();
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Successful login: reset failed attempt counters and lock fields, update last login time
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastFailedAttempt = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate a JWT token with isAdmin set to true
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in admin:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
