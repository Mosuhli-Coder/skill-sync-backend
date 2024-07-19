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
router.patch("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/user-info/:id", verifyToken, getUserById);

export default router;
