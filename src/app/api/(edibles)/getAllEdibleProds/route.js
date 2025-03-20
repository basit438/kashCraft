import connectDB from "@/lib/utils/db";
import EdibleModel from "@/models/edibleSchema";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    await connectDB();
    const {category, subCategory, name, weight, price, rangePrice} = params;
    
    // const searchParams = request.nextUrl.searchParams;
    // const category = searchParams.get("category");
    // const subCategory = searchParams.get("subCategory");
    // const name = searchParams.get("name");
    // const weight = searchParams.get("weight");
    // const price = searchParams.get("price");
    // const rangePrice = searchParams.get("rangePrice"); // Expected 'asc' or 'desc'
    
    let query = {};

    if (category) {
        query.category = category;
    }
    if (name || subCategory) {
        query.$or = [];
        if (name) query.$or.push({ name });
        if (subCategory) query.$or.push({ subCategory });
    }
    if (weight) {
        query.weight = weight;
    }
    
    try {
        let allEdibleProducts = await EdibleModel.find(query);

        if (price && rangePrice) {
            allEdibleProducts = allEdibleProducts.sort((a, b) => 
                rangePrice === "asc" ? a.price - b.price : b.price - a.price
            );
        }

        if (!allEdibleProducts.length) {
            return NextResponse.json(
                { message: "Sorry, no edible products found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Products fetched successfully", product: allEdibleProducts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching edibles:", error);
        return NextResponse.json(
            { message: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}