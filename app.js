import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import skillsRouter from "./routes/skill.route.js";
import notificationRouter from "./routes/notification.route.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

// const app = express();
const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ["http://localhost:5173"];

const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigin;
console.log("allowedOrigins: ", allowedOrigins);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/notifications", notificationRouter);

server.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${process.env.PORT}`);
});
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
