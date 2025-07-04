import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/AsyncHandler.js';
import User from '../services/auth/models/User.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token);
    console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken.id).select("-password");
    console.log("User found in middleware:", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
