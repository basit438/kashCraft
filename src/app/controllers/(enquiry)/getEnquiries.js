import dbConnect from "@/lib/utils/db.js";
import Enquiry from "@/models/Enquiry.model.js";

export const getEnquiries = async (req) => {
  try {
    await dbConnect();

    const enquiries = await Enquiry.find();
    return new Response(
      JSON.stringify({ message: "Enquiries retrieved successfully.", enquiries }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
