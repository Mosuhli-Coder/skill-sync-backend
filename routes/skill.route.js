
import { createSkills, matchSkills } from "../controllers/skill.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.post("/create/:id", verifyToken, createSkills);
// router.get("/list", verifyToken, getSkills);
router.get("/match/:id", verifyToken, matchSkills);
export default router;