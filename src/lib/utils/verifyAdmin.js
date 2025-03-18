import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const verifyAdmin = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: No token provided" }),
      { status: 401 }
    );
  }

  // Expected header format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: No token provided" }),
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if token payload has isAdmin set to true
    if (!decoded.isAdmin) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden: Admins only" }),
        { status: 403 }
      );
    }
    return decoded;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: Invalid token", error: error.message }),
      { status: 401 }
    );
  }
};
