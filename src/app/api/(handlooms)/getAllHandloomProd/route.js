import connectDB from "@/lib/utils/db";
import { NextResponse } from "next/server";
import HandloomModel from "@/models/handloomSchema ";

export async function GET(request, {params}){
    await connectDB();
    const {name, price, rangePrice, size, fabricType, gender, category, subCategory} = await params;
    let query = {};
    if(name || subCategory) {
        query.$or = [];
        if(name) query.$or.push(name);
        if(subCategory) query.$or.push(subCategory);
    }
    if(size) {
        query.size = size;
    }
    if(category) {
        query.category = category;
    }
    if(fabricType) {
        query.fabricType = fabricType;
    }
    if(gender) {
        query.gender = gender;
    }
    try {
        let allHandloomProducts = await HandloomModel.find(query);
        if(price && rangePrice) {
            allHandloomProducts = allHandloomProducts.sort((a, b)=> rangePrice === "asc" ? a.price - b.price : b.price - a.price);
        }
        if(!allHandloomProducts) {
            return NextResponse.json({message:"Sorry there are no such edible products available"}, {status:400});
        }
        return NextResponse.json({message:"All edible products has been fetched successfully", product:allHandloomProducts}, {status:200});
    } catch (error) {
        console.log('====================================');
        console.log("There are some errors in get all handloom products controller plz fix the bug first", error);
        console.log('====================================');
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500})
    }
}