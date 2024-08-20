import express from "express";
import {
  deleteUser,
  updateUser,
  getUsers,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/list", getUsers);
router.patch("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/user-info/:userId", verifyToken, getUserById);

export default router;
