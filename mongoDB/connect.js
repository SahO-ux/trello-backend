import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", false);

  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

export default connectDB;
