import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
   

    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true, // Enables the new Server Discovery and Monitoring engine
    });

    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error); 

    
    process.exit(1);
  }
};

export default connectDB;
