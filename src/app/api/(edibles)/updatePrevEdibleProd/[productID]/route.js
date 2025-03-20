import connectDB from "@/lib/utils/db";
import EdibleModel from "@/models/edibleSchema";
import { NextResponse } from "next/server";

export async function PUT(request, {params}) {
    await connectDB();
    const {productID} = await params;
    const {name, description, price, ingredients, expiryDate, weight, storageInstructions, stock, category, subCategory,} = await request.json();
    try {
        const updateProd = await EdibleModel.findById(productID);
        if(!updateProd) {
            return NextResponse.json({message:"Sorry product not found"}, {status:500});
        }
          if (
            !name ||
            !description ||
            !price ||
            !ingredients ||
            !expiryDate ||
            !weight ||
            !category ||
            !subCategory
          ) {
            console.log("All Fields Are Required");
            return NextResponse.json(
              { message: "All Fields Are Required" },
              { status: 422 }
            );
          }
        const updatedProduct = await EdibleModel.findByIdAndUpdate(productID, {name, description, price, ingredients, expiryDate, weight, storageInstructions, stock, category, subCategory});
        return NextResponse.json({message:"Your product has been updated successfully", product:updatedProduct}, {status:201});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in  update previous edible product controller plz fix the bug first ", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500});
    }
}