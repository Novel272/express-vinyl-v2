import dotenv from "dotenv";
import mongoose from "mongoose";
import vinylModel from "./models/vinylSC.js";
import { vinyl } from "./data/data.js";

dotenv.config();

const seedDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await vinylModel.deleteMany({});
    await vinylModel.insertMany(vinyl);
    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit();
  }
};
seedDb();
