import mongoose from "mongoose";

const edibleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: [{ type: String, required: true }],
  expiryDate: { type: Date, required: true },
  weight: { type: Number, required: true }, 
  storageInstructions: { type: String },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
  category:{
    type:String,
    required:true,
    enum:["Dry Fruits", "Spices", "Beverages", "Sweets", "Others"]
  },
  subCategory:{
    type:String,
    required:true
  },
  createdAt: { type: Date, default: Date.now },
});
// category
const EdibleModel = mongoose.models.Edible || mongoose.model("Edible", edibleSchema);
export default EdibleModel;
