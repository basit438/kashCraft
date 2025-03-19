import dbConnect from "@/lib/utils/db.js";
import Enquiry from "@/models/Enquiry.model.js";

export const deleteEnquiry = async (req) => {
  try {
    await dbConnect();

    // Expecting the enquiry id in the request body
    const { id } = await req.json();
    if (!id) {
      return new Response(
        JSON.stringify({ message: "Enquiry id is required" }),
        { status: 400 }
      );
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    if (!deletedEnquiry) {
      return new Response(
        JSON.stringify({ message: "Enquiry not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Enquiry deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
