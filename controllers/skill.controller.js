import User from "../models/user.model.js";
import UserSkills from "../models/userSkills.model.js";
import { errorHandler } from "../utils/error.js";

export const createSkills = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(401, "You can only create your own skills"));
  }
  if (!req.body.skillsToTeach && !req.body.skillsToLearn) {
    return next(errorHandler(400, "Skills to teach or learn are required"));
  }
  try {
    const { skillsToTeach, skillsToLearn } = req.body;
    const userSkills = await UserSkills.findOne({ userRef: req.params.userId });
    if (userSkills) {
      return next(
        errorHandler(400, "User skills already exists, try updating instead")
      );
    }
    const newSkills = new UserSkills({
      userRef: req.user.userId,
      skillsToTeach,
      skillsToLearn,
    });
    const savedSkills = await newSkills.save();
    await User.findByIdAndUpdate(
      req.params.userId,
      { userSkills: savedSkills._id },
      { new: true }
    );
    res.status(201).json(savedSkills);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const userSkills = await UserSkills.find({ userRef: req.user.userId });
    if (!userSkills) {
      return next(
        errorHandler(404, "User skills not found, try creating instead")
      );
    }
    res.status(200).json(userSkills);
  } catch (error) {
    next(error);
  }
};

export const updateSkills = async (req, res, next) => {
  try {
    const { skillsToTeach, skillsToLearn } = req.body;
    const userSkills = await UserSkills.findOneAndUpdate(
      { userRef: req.params.id },
      { skillsToTeach, skillsToLearn },
      { new: true }
    );
    if (!userSkills) {
      return next(errorHandler(404, "User skills not found"));
    }
    res.status(200).json(userSkills);
  } catch (error) {
    next(error);
  }
};

export const deleteSkills = async (req, res, next) => {
  try {
    const userSkills = await UserSkills.findOneAndDelete({
      userRef: req.params.id,
    });
    if (!userSkills) {
      return next(errorHandler(404, "User skills not found"));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};


export const getUsersAndSkills = async (req, res, next) => {
  try {
    const users = await UserSkills.find({ userRef: { $ne: req.user.userId } })
      .populate({
        path: "userSkills",
        populate: {
          path: "skillsToTeach.skillsToLearn skillsToLearn.skillsToTeach",
          model: "UserSkills",
          select: "name level",
        },
        strictPopulate: false,
      })
      .populate({
        path: "userRef",
        select: "firstName lastName email avatar",
      });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};