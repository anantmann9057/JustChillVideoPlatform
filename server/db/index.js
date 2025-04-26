import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
export const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database Connected!"))
    .catch((e) => {
      console.log(e.message);
    });
};
