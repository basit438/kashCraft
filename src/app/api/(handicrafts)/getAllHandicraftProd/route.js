import connectDB from "@/lib/utils/db";
import { NextResponse } from "next/server";
import HandicraftModel from "@/models/handicraftSchema";

export async function GET(request, {params}){
    await connectDB();
    const {name, price, material, rangePrice, category, subCategory} = await params;
    let query = {};
    if(material) {
        query.material = material;
    }
    if(category) {
        query.category = category;
    }
    if(name || subCategory) {
        query.$or = [];
        if(price) query.$or.push(name);
        if(subCategory) query.$or.push(subCategory);
    }
    try {
        let allHandicraftProds = await HandicraftModel.find(query);
        if(price && rangePrice) {
            allHandicraftProds = allHandicraftProds.sort((a, b)=> rangePrice === "asc" ? a.price - b.price : b.price - a.price)
        }
        if(!allHandicraftProds) {
            return NextResponse.json({message:"Sorry there are no such edible products available"}, {status:400});
        }

        return NextResponse.json({message:"All edible products has been fetched successfully", product:allHandicraftProds}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in get all handicraft product controller plz fix the bug first", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500})
    }
}