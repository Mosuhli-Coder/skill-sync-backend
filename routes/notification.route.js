import express from "express";
import {
  sendNotification,
  getNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/send/:id", verifyToken, sendNotification);
router.get("/list/", verifyToken, getNotification);
router.get("/list/:id", verifyToken, getNotificationById);
router.patch("/:id/read", verifyToken, updateNotification);
router.delete("/delete/:id", verifyToken, deleteNotification);

export default router;
