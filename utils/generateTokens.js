import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const generateTokens = (user) => {
  // Secret keys (In production, store these in environment variables)
  const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret";
  const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";

  // Token expiration times (In production, configure these based on your needs)
  const ACCESS_TOKEN_EXPIRATION = "24h"; // 15 minutes
  const REFRESH_TOKEN_EXPIRATION = "7d"; // 7 days

  const accessToken = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken, refreshToken };
};
