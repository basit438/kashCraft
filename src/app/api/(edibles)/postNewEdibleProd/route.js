import connectDB from "@/lib/utils/db";
import { NextResponse } from "next/server";
import cloudImgUpload from "@/lib/cloudUpload";
import EdibleModel from "@/models/edibleSchema ";

export async function POST(request) {
  await connectDB();
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const ingredients = formData.get("ingredients");
  const expiryDate = formData.get("expiryDate");
  const weight = formData.get("weight");
  const category = formData.get("category");
  const subCategory = formData.get("subCategory");
  const stock = formData.get("stock");
  const storageInstructions = formData.get("storageInstructions");
  const images = formData.getAll("images");
  if (
    !name ||
    !description ||
    !price ||
    !ingredients ||
    !expiryDate ||
    !weight ||
    !category ||
    !subCategory
  ) {
    console.log("All Fields Are Required");
    return NextResponse.json(
      { message: "All Fields Are Required" },
      { status: 422 }
    );
  }
  let base64Images = [];
  try {
    for (let image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      base64Images.push(buffer.toString("base64"));
    }
    const imgURLArr = await cloudImgUpload(base64Images);
    const addedProd = await EdibleModel.create({
      name, description, price, ingredients, expiryDate, weight, storageInstructions, stock, category, subCategory, images:imgURLArr
    });
    return NextResponse.json({message:"Product has been added successfully", product:addedProd}, {status:201});
  } catch (error) {
    console.log(
      "There are some errors in your post edible product controller plz fix the bug first ",
      error
    );
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}
