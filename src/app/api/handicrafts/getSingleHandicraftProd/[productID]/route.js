import connectDB from "@/lib/utils/db";
import HandicraftModel from "@/models/handicraftSchema";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    await connectDB();
    const {productID} = await params;
    try {
        const singleProduct = await HandicraftModel.findById(productID);
        if(!singleProduct) {
            return NextResponse.json({message:"Sorry product not found"}, {status:500});
        }
        return NextResponse.json({message:"Product has been fetched successfully", product:singleProduct}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in your get single HandicraftModel controller plz fix the bug first ", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500});
    }
}