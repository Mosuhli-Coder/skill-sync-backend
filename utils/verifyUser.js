import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const authToken = authHeader?.split(" ")[1];
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    const decoded = jwt.verify(authToken, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
