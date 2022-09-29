const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    if (!(await User.exists({ email: decoded.email }))) {
      res.status(404);
      throw new Error("User Not Found"); // or next(new Error("User Not Found")); next(error) better and cleaner
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    res.status(401);
    next(error);
    
  }
};

module.exports = {
  protect,
};
