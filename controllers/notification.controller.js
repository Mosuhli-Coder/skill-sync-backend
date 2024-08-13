import Notification from "../models/notification.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const sendNotification = async (req, res, next) => {
  try {
    const { message, type } = req.body;
    const { id: recipientId } = req.params;
    const senderId = req.user.id;

    const notification = new Notification({
      recipientId,
      senderId,
      message,
      type,
    });

    const createdNotification = await notification.save();

    // Emit the notification to the user room
    // io.to(userId).emit("new_notification", notification);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(recipientId);
    console.log("receiverSocketId: ", receiverSocketId);
    console.log("recipientId: ", recipientId);
    if (receiverSocketId) {
      console.log("receiverSocketId: ", receiverSocketId);
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("new_notification", notification);
    }
    res.status(201).json(createdNotification);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getNotification = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "firstName lastName avatar");

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id).populate(
      "senderId",
      "firstName lastName avatar"
    );
    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
