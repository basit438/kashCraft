import connectDB from "@/lib/utils/db";
import EdibleModel from "@/models/edibleSchema";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await connectDB();
  const { productID } = await params;
  try {
    const findTheProduct = await EdibleModel.findById(productID);
    if (!findTheProduct) {
      return NextResponse.json(
        { message: "This product does't exists" },
        { status: 404 }
      );
    }
    await EdibleModel.findByIdAndDelete(productID);
    return NextResponse.json(
      { message: "Your product has been deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("====================================");
    console.log(
      "There are some errors in delete edible product plz fix the bug first ",
      error
    );
    console.log("====================================");
    return NextResponse.json(
      { message: `Internal Server Error ${error.message}` },
      { status: 500 }
    );
  }
}
