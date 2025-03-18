import cloudImgUpload from "@/lib/cloudUpload";
import connectDB from "@/lib/utils/db";
import HandloomModel from "@/models/handloomSchema ";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectDB();
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const fabricType = formData.get("fabricType");
    const size = formData.get("size");
    const gender = formData.get("gender");
    const washingInstructions = formData.get("washingInstructions");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const images = formData.getAll("images");
    if(!name || !description || ! price || !fabricType || !size || !gender || !images || !category || !subCategory) {
        console.log("All fields are required");
        return NextResponse.json({message:"Some required fields are missing"}, {status:422});
    }
    let base64Images = [];
    try {
        for(let img of images) {
            const buffer = Buffer.from(await img.arrayBuffer());
            base64Images.push(buffer.toString("base64"));
        }
        const cloudImgsURLs = await cloudImgUpload(base64Images);
        if(cloudImgsURLs.length === 0 || !cloudImgsURLs) {
            console.log("This is return cloud imgs urls ", cloudImgsURLs);
            return NextResponse.json({message:"Images are required"}, {status:422});
        }
        const addedProduct = await HandloomModel.create({
            name, description, price, fabricType, size, gender, washingInstructions, images:cloudImgsURLs, stock, category, subCategory
        });
        return NextResponse.json({message:"Product added successfully", product:addedProduct}, {status:201});
    } catch (error) {
        console.log("There are some errors in add handloom product plz fix the bug ", error);
        return NextResponse.json({message:`Internal Server Error ${error.message}`}, {status:500});
    }
}