import mongoose from "mongoose";

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  certifications: [String],
  description: {
    type: String,
    required: true,
  },
  tools: [String],
  projects: [String],
});

const userSkillsSchema = new Schema(
  {
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillsToTeach: [skillSchema],
    skillsToLearn: [String],
  },
  { timestamps: true }
);

const UserSkills = mongoose.model("UserSkills", userSkillsSchema);
export default UserSkills;
