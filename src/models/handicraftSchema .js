import mongoose from "mongoose";

const handicraftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  material: { type: String, required: true },
  dimensions: { type: String }, // Example: "10x5x3 cm"
  weight: { type: Number, required:true }, 
  handmade: { type: Boolean, default: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
  category:{
    type:String,
    required:true,
    enum:["Papier-Mâché", "Walnut Wood Carving", "Wooden Work", "Copperware", "Crewel/Chain Stitch Embroidery", "Silverware", "Wicker Work", "Others"],
  },
  subCategory:{
    type:String,
    required:true
  },
  createdAt: { type: Date, default: Date.now },
});

const HandicraftModel = mongoose.models.Handicraft || mongoose.model("Handicraft", handicraftSchema);
export default HandicraftModel;
