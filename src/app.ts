import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import errorHandler from "./middleware/error";
import { globalErrorHandler, CustomError } from "./middleware/error";
import router from "./routers";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(globalErrorHandler);
app.use(router);

// health check
app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "pong" });
});

const SERVER_PORT = process.env.SERVER_PORT || 5000;

async function connectToDatabase() {
  const DB_URI = process.env.MONGODB_URI;
  if (!DB_URI) {
    console.error("MONGODB_URI not set in the .env file.");
    throw new CustomError("Database URI not configured.", 400);
  }

  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new CustomError("Failed to connect to the database.", 400);
  }
}

connectToDatabase()
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
  });
