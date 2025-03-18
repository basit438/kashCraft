import connectDB from "@/lib/utils/db";
import { NextResponse } from "next/server";
import HandicraftModel from "@/models/handicraftSchema";

export async function GET(){
    await connectDB();
    try {
        const allHandicraftProds = await HandicraftModel.find({});
        if(!allHandicraftProds) {
            return NextResponse.json({message:"Sorry there are no such edible products available"}, {status:500});
        }
        return NextResponse.json({message:"All edible products has been fetched successfully", product:allHandicraftProds}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in get all handicraft product controller plz fix the bug first", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500})
    }
}