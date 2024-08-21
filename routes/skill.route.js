
import { createSkills, getSkills, getUsersAndSkills } from "../controllers/skill.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.post("/create/:userId", verifyToken, createSkills);
router.get("/list", verifyToken, getSkills);
router.get("/user/list", verifyToken, getUsersAndSkills);
export default router;