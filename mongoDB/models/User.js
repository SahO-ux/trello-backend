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
      min: 5,
      validate: {
        validator: function (val) {
          // Ensure password is provided if not using Google OAuth
          return this.googleLogin || (val && val.length >= 5);
        },
        message: "Password is required and must be at least 5 characters long.",
      },
    },

    googleLogin: {
      type: Boolean,
      default: false, // Indicates if the user logged in via Google
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Gives automatic dates for when it's created/updated
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
