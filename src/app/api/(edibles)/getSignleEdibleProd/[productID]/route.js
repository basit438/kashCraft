import connectDB from "@/lib/utils/db";
import EdibleModel from "@/models/edibleSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await connectDB();

    const { productID } = params; 
    try {
        const singleProduct = await EdibleModel.findById(productID);
        if (!singleProduct) {
            return NextResponse.json({ message: "Sorry, product not found" }, { status: 404 });
        }

        const similarProducts = await EdibleModel.find({
            subCategory: singleProduct.subCategory,
            _id: { $ne: productID } 
        });

        return NextResponse.json(
            { message: "Product fetched successfully", product: singleProduct, similarProducts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching single edible product:", error);
        return NextResponse.json(
            { message: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}