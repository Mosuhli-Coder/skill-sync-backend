import User from "../models/user.model.js";
import UserSkills from "../models/userSkills.model.js";
import { errorHandler } from "../utils/error.js";

export const createSkills = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(401, "You can only create your own skills"));
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
    res.status(201).json(savedSkills);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(401, "You can only get your own skills"));
  }
  try {
    const userSkills = await UserSkills.findOne({ userRef: req.params.userId });
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

// export const matchSkills = async (req, res, next) => {
//   try {
//     const userSkills = await UserSkills.findOne({ userRef: req.params.id });
//     if (!userSkills) {
//       return next(errorHandler(404, "User skills not found"));
//     }
//     if (req.user.id !== req.params.id) {
//       return next(errorHandler(400, "You can only match with yourself"));
//     }
//     // Find matches
//     const matches = await UserSkills.find({
//       userRef: { $ne: req.params.id }, // Exclude the current user
//       skillsToTeach: {
//         $elemMatch: {
//           name: { $in: userSkills.skillsToLearn }, // Check if any skill to teach matches skills to learn
//         },
//       },
//     }).populate("userRef", "firstName lastName email, avatar"); // Process matches to include the matched skills
//     const processedMatches = matches
//       .map((match) => {
//         const matchedSkills = match.skillsToTeach.filter((skillToTeach) =>
//           userSkills.skillsToLearn.includes(skillToTeach.name)
//         );
//         return { user: match.userRef, matchedSkills: matchedSkills };
//       })
//       .filter((match) => match.matchedSkills.length > 0); // Filter out matches with no matched skills
//     // return res.json({ success: true, matches: processedMatches });
//     res.status(200).json(processedMatches);
//   } catch (error) {
//     next(error);
//   }
// };

export const matchSkills = async (req, res, next) => {
  try {
    const userSkills = await UserSkills.findOne({ userRef: req.params.userId });
    if (!userSkills) {
      return next(errorHandler(404, "User skills not found"));
    }
    if (req.user.userId !== req.params.userId) {
      return next(errorHandler(400, "You can only match with yourself"));
    }

    // Find matches based on skills to teach or skills to learn
    const matches = await UserSkills.find({
      userRef: { $ne: req.params.userId }, // Exclude the current user
    }).populate("userRef", "firstName lastName email avatar");

    // Process matches to include the matched skills
    // const processedMatches = matches.map(match => {
    //   const matchedTeachSkills = match.skillsToTeach.filter(skillToTeach => userSkills.skillsToLearn.includes(skillToTeach.name));
    //   const matchedLearnSkills = match.skillsToLearn.filter(skillToLearn => userSkills.skillsToTeach.includes(skillToLearn.name));

    //   return {
    //     user: match.userRef,
    //     matchedTeachSkills,
    //     matchedLearnSkills
    //   };
    // }).filter(match => match.matchedTeachSkills.length > 0 || match.matchedLearnSkills.length > 0); // Filter out matches with no matched skills

    res.status(200).json(matches);
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

export const searchSkillsMatching = async (req, res, next) => {
  try {
    const skills = await UserSkills.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};
