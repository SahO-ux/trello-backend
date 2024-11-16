import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../mongoDB/models/User.js";
import _ from "lodash";

//Registering User

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath } = req.body;

    const userAlreadyExists = await User.findOne({ email: email });

    if (userAlreadyExists)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      ...(picturePath ? { picturePath } : {}),
      //   friends,
      //   location,
      //   occupation,
      //   viewedProfile: Math.floor(Math.random() * 10000),
      //   impressions: Math.floor(Math.random() * 10000),
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const _user = await User.findOne({ email: email }).lean();
    // const _user = _.cloneDeep(user.lean());

    if (!_user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, _user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: _user.id }, process.env.JWT_SECRET);
    delete _user.password; //does not get sent back to frtnd

    res.status(200).json({ token, user: _user });
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
