import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
