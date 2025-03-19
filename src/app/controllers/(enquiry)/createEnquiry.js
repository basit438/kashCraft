import dbConnect from "@/lib/utils/db.js";
import Enquiry from "@/models/Enquiry.model.js";
export const createEnquiry = async (req) => {
  try {
    await dbConnect();

    
    const { name, email, subject, message, category, productId, sellerId } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ message: "Name, email, subject, and message are required." }),
        { status: 400 }
      );
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      subject,
      message,
      category: category || "general", // defaults to "general" if not provided
      productId,
      sellerId,
    });

    await newEnquiry.save();

    return new Response(
      JSON.stringify({ message: "Enquiry submitted successfully.", enquiry: newEnquiry }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
