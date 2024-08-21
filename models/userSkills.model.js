import mongoose from "mongoose";


const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
});

const userSkillsSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillsToTeach: [skillSchema],
  skillsToLearn: [skillSchema],
});

const UserSkills = mongoose.model("UserSkills", userSkillsSchema);
export default UserSkills;
