import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateTokens } from "../utils/generateTokens.js";

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
    const { password: pass, ...rest } = newUser._doc;
    const { accessToken, refreshToken } = generateTokens(rest);

    res.status(200).json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    res;
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
    const { password: pass, ...rest } = validUser._doc;
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(rest);

    res.status(200).json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
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
