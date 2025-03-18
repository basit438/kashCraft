import {v2 as cloudinary} from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({ 
  cloud_name: process.env.cloud_name,
  api_key:process.env.api_key, 
  api_secret: process.env.api_secret
});
const cloudImgUpload = async (imagesArr)=>{
    if(!imagesArr) {
        console.log("This is imagesArr received in cloudImgUpload ", imagesArr);
        return NextResponse.json({message:"Images are required for cloud upload"}, {status:422});
    }
    let cloudUrl = [];
    try {
        for(let img of imagesArr) {
         const res =  await cloudinary.uploader.upload(`data:image/jpeg;base64,${img}`);
         cloudUrl.push(res.secure_url);
        }
        return cloudUrl;
    } catch (error) {
        console.log("There are some errors in your cloudImgUpload controller ", error);
        return NextResponse.json({message:`Error in cloudinary uploader function ${error}`}, {status:500});
    }
}
export default cloudImgUpload;