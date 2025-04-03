import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findById(decoded.user._id);

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Check if token is expired
    if (user.tokenExpiry < new Date()) {
      return res
        .status(401)
        .json({ message: "Token has expired, please login again" });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
