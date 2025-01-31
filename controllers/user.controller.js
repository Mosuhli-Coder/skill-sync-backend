import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // const { password: pass, ...rest } = users._doc;

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(401, "You can only update your own account"));
  }
  try {
    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        return next(errorHandler(401, "Passwords do not match"));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          avatar: req.body.avatar,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

export const deleteUser = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(401, "You can only delete your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req, res, next) => {
  if (req.user.userId === req.params.userId) {
    try {
      const userInfo = await User.findById({ _id: req.params.userId });
    
      const { password: pass, ...rest } = userInfo._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listing"));
  }
};
