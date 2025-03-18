import connectDB from "@/lib/utils/db";
import EdibleModel from "@/models/edibleSchema";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB();
    try {
        const allEdibleProducts = await EdibleModel.find({});
        if(!allEdibleProducts) {
            return NextResponse.json({message:"Sorry there are no such edible products available"}, {status:500});
        }
        return NextResponse.json({message:"All edible products has been fetched successfully", product:allEdibleProducts}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in get all edibles controller plz fix the bug first", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500})
    }
}