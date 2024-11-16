import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv, { config } from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

import { register } from "./controllers/auth.js";
// import { createPost } from "./controllers/posts.js";
import connectDB from "./mongoDB/connect.js";
import { verifyToken } from "./middleware/auth.js";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
} from "./controllers/task.js";
// import User from "./mongoDB/models/Users.js";
// import PostModel from "./mongoDB/models/Post.js";
// import { users, posts } from "./data/index.js";

//Configs needed since we're using type="module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//---------------------------------------------//

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


//ROUTES
app.post("/auth/register", register);
app.use("/users", userRoutes);

app.post("/:userId/create-task", verifyToken, createTask);
app.patch("/:userId/update-task", verifyToken, updateTask);
app.get("/:userId/get-tasks", verifyToken, getUserTasks);
app.delete("/delete-task/:taskId", verifyToken, deleteTask);

//Auth Routes
app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      console.log(`SERVER LISTENING AT http://localhost:${PORT}`)
    );

    //  // Add Data one time
    //  await User.insertMany(users);
    //  await PostModel.insertMany(posts);
  } catch (error) {
    console.log(error);
  }
};
startServer();
