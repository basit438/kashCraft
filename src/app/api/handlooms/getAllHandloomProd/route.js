import connectDB from "@/lib/utils/db";
import { NextResponse } from "next/server";
import HandloomModel from "@/models/handloomSchema ";

export async function GET(){
    await connectDB();
    try {
        const allHandloomProducts = await HandloomModel.find({});
        if(!allHandloomProducts) {
            return NextResponse.json({message:"Sorry there are no such edible products available"}, {status:500});
        }
        return NextResponse.json({message:"All edible products has been fetched successfully", product:allHandloomProducts}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in get all handloom products controller plz fix the bug first", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500})
    }
}