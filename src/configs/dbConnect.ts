import { MongoClient, ServerApiVersion } from "mongodb";
import { dbConfig } from "../utils/constants";
import mongoose from "mongoose";
//
const uri = `mongodb+srv://${dbConfig.dbUser}:${dbConfig.dbPassword}@cluster0.xxn2mv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// iki a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function dbConnect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected");
  } finally {
    await client.close();
  }
}
