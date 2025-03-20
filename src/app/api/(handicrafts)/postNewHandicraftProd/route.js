import cloudImgUpload from "@/lib/cloudUpload";
import connectDB from "@/lib/utils/db";
import HandicraftModel from "@/models/handicraftSchema ";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectDB();
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const material = formData.get("material");
    const dimensions = formData.get("dimensions");
    const weight = formData.get("weight");
    const handmade = formData.get("handmade");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const images = formData.getAll("images");
    if(!name || !description || !price || !material || !weight || !images || !category || !subCategory) {
        console.log("All fields are required");
        return NextResponse.json({message:"Required fields are missing"}, {status:422});
    }
    let base64Images = [];
    try {
     for(let img of images) {
        const buffer = Buffer.from(await img.arrayBuffer());
        base64Images.push(buffer.toString("base64"));
     }
     const cloudImgsURLs = await cloudImgUpload(base64Images);
     const addedProduct = await HandicraftModel.create({
        name, description, price, material, dimensions, weight, handmade, images: cloudImgsURLs, stock, category, subCategory
     });
     return NextResponse.json({message:"Product has uploaded successfully.", product:addedProduct}, {status:201});
    } catch (error) {
        console.log("There are some errors in add handicraft products ", error);
        return NextResponse.json({message:`Internal Server error ${error.message}`}, {status:500});
    }
}