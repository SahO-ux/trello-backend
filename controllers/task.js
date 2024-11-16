import { convertSearchTermtoRegex } from "../helpers/index.js";
import Task from "../mongoDB/models/Task.js";
import mongoose from "mongoose";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = await Task.create({
      userId: mongoose.Types.ObjectId(req.params.userId),
      title: title?.trim(),
      description,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(409).json({ msg: err.message });
  }
};

// Update
export const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    //   const user = await User.findById(userId);

    const updateTask = await Task.updateOne(
      {
        userId: mongoose.Types.ObjectId(req.params.userId),
        _id: mongoose.Types.ObjectId(req.params.userId),
      },
      {
        $set: {
          title: title,
          description: description,
        },
      }
    );

    res.status(201).json(updateTask);
  } catch (err) {
    res.status(409).json({ msg: err.message });
  }
};

//Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.updateOne(
      {
        userId: mongoose.Types.ObjectId(req.body.userId),
        _id: mongoose.Types.ObjectId(taskId),
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    res.status(201).json(deletedTask);
  } catch (err) {
    res.status(409).json({ msg: err.message });
  }
};

// Get Task

export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { searchTerm } = req.query;

    const criteria = {
      isDeleted: false,
      userId: mongoose.Types.ObjectId(userId),
    };

    if (searchTerm) {
      const validRegex = convertSearchTermtoRegex(searchTerm);
      criteria["$or"] = [
        { description: { $regex: validRegex } },
        { title: { $regex: validRegex } },
      ];
    }

    const tasks = await Task.find(criteria);

    res.status(200).json(tasks);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};
