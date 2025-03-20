import connectDB from "@/lib/utils/db";
import HandicraftModel from "@/models/handicraftSchema";
import { NextResponse } from "next/server";

export async function PUT(request, {params}) {
    await connectDB();
    const {productID} = await params;
    const {name, description, price, material, dimensions, weight, handmade, images: cloudImgsURLs, stock, category, subCategory} = await request.json();
    try {
        const updateProd = await HandicraftModel.findById(productID);
        if(!updateProd) {
            return NextResponse.json({message:"Sorry product not found"}, {status:500});
        }
        if(!name || !description || !price || !material || !weight || !images || !category || !subCategory) {
          console.log("All fields are required");
          return NextResponse.json({message:"Required fields are missing"}, {status:422});
      }
        const updatedProduct = await HandicraftModel.findByIdAndUpdate(productID, {name, description, price, material, dimensions, weight, handmade, images: cloudImgsURLs, stock, category, subCategory});
        return NextResponse.json({message:"Your product has been updated successfully", product:updatedProduct}, {status:201});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in  update previous Handicraft product controller plz fix the bug first ", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500});
    }
}