import dbConnect from "@/lib/utils/db.js";
import Enquiry from "@/models/Enquiry.model.js";

export const updateEnquiry = async (req) => {
  try {
    await dbConnect();

    // Expecting the enquiry id and the new status in the request body
    const { id, status } = await req.json();
    if (!id) {
      return new Response(
        JSON.stringify({ message: "Enquiry id is required" }),
        { status: 400 }
      );
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEnquiry) {
      return new Response(
        JSON.stringify({ message: "Enquiry not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Enquiry updated successfully.", enquiry: updatedEnquiry }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
