import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB URL not defined in Enviorment Variables");
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected To DB: ", conn.connection.host);
  } catch (error) {
    console.error("Connection Error: ", error);
    process.exit(1);
  }
};
