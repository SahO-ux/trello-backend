import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import _ from "lodash";

import User from "../mongoDB/models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Registering User
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath } = req.body;

    const userAlreadyExists = await User.findOne({
      email: email?.trim()?.toLowerCase(),
    });

    if (userAlreadyExists)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email: email?.trim()?.toLowerCase(),
      password: passwordHash,
      ...(picturePath ? { picturePath } : {})
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle login
export const login = async (req, res) => {
  try {
    const { email, password, googleToken } = req.body;

    if (googleToken) {
      // Handle Google OAuth login
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload(); // Decoded Google user info
      const { email: googleEmail, given_name, family_name } = payload;

      let user = await User.findOne({ email: googleEmail });

      if (!user) {
        // If user doesn't exist, create a new one
        user = new User({
          email: googleEmail,
          firstName: given_name,
          lastName: family_name,
          password: null, // Password not needed for OAuth
          googleLogin: true,
        });
        await user.save();
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({ token, user });
    } else {
      // Handle traditional email/password login
      const user = await User.findOne({ email: email?.trim()?.toLowerCase() }).lean();

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password; // Remove password before sending response

      return res.status(200).json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Check if the token exists in the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ msg: "No token provided" });
    }

    res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
