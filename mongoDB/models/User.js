import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
      validate: {
        validator: function (val) {
          return validator.isEmail(val);
        },
        message: (props) => console.log(`${props.value} is not a valid email`),
      },
    },

    password: {
      type: String,
      required: true,
      min: 5,
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Gives automatic dates for when its created/updated...
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
