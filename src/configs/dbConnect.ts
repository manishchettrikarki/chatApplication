import { dbConfig } from "../utils/constants";
import mongoose from "mongoose";

//
const uri = `mongodb+srv://${dbConfig.dbUser}:${dbConfig.dbPassword}@cluster0.xxn2mv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

/**
 *
 */
export async function dbConnect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to db");
  } catch (error) {
    console.log("dbError", error);
  }
}
