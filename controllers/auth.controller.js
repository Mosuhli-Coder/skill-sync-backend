import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { lastName, firstName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(errorHandler(400, "Passwords do not match"));
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(errorHandler(400, "User already exists"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    lastName,
    firstName,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Adjust sameSite attribute based on your requirements
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Adjust sameSite attribute based on your requirements
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
