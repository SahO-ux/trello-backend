import mongoose from "mongoose";

const taskStatuses = ["To do", "In progress", "Done"];

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    description: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    status: {
      type: String,
      optional: true,
      default: "To do",
      enum: taskStatuses,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      optional: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Gives automatic dates for when its created/updated...
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
