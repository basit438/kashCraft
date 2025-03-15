import jwt from "jsonwebtoken";
import User from "@/models/user.model.js";
import dbConnect from "@/lib/utils/db.js";

export const POST = async (req) => {
  try {
    await dbConnect(); // Connect to MongoDB

    const { token } = await req.json();

    if (!token) {
      return Response.json({ message: "Missing token" }, { status: 400 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Find user and update verification status
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Email verified successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json({ message: "Invalid or expired token" }, { status: 400 });
  }
};
