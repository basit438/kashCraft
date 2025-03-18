import mongoose from "mongoose";

const handloomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  fabricType: { type: String, required: true },
  size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
  gender: { type: String, enum: ["Men", "Women", "Unisex"], required: true },
  washingInstructions: { type: String },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
  category:{
    required:true, //shall, top
    type:String,
    enum:["Pashmina Wool Products", " Kani Weaving", " Sozni Embroidery", "Namda & Gabba", " Silk & Cotton Handlooms"],
  },
  subCategory:{
    type:String,
    required:true 
  },
  createdAt: { type: Date, default: Date.now },
});
const HandloomModel =  mongoose.models.Handloom ||
  mongoose.model("Handloom", handloomSchema);
export default HandloomModel;
