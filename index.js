import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import connectDB from "./mongoDB/connect.js";
import { verifyToken } from "./middleware/auth.js";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
} from "./controllers/task.js";

// Replace this with your deployed frontend URL
const allowedOrigins = ["https://trello-frontend-delta.vercel.app"];

// Configs for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
dotenv.config();
const app = express();

// CORS Configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight requests

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.use(morgan("common"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Vercel route
app.get("/", (req, res) => {
  res.json("Hello");
});

// Routes
app.post("/auth/register", register);
app.post("/:userId/create-task", verifyToken, createTask);
app.patch("/:userId/update-task", verifyToken, updateTask);
app.get("/:userId/get-tasks", verifyToken, getUserTasks);
app.delete("/delete-task/:taskId", verifyToken, deleteTask);
app.use("/auth", authRoutes);

// Start server
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      console.log(`SERVER LISTENING AT http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};
startServer();
