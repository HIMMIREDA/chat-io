const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("../validators/validate");

// @desc : register user
// @route: POST /api/users
// @access: Private

const registerUser = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;
  name = name ? name.trim() : null;
  email = email ? email.trim() : null;
  password = password ? password.trim() : null;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }

  if (!validator.validateEmail(email)) {
    res.status(400);
    throw new Error("Please give a correct email");
  }

  // check if email exists
  if (await User.exists({ email })) {
    res.status(400);
    throw new Error(`a User with ${email} already exists`);
  }

  const hanshedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, name, password: hanshedPassword });
  await user.save();
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: 30 * 60,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "31d",
  });

  user.refreshTokens.push(refreshToken);
  await user.save();
  //   store refresh token in a http only cookie
  res.cookie("JWT-REFRESH-TOKEN", refreshToken, {
    httpOnly: true,
    maxAge: 31 * 24 * 3600,
  });
  return res.status(200).json({
    accessToken,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  email = email ? email.trim() : null;
  password = password ? password.trim() : null;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: 30 * 60,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "31d",
  });
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.cookie("JWT-REFRESH-TOKEN", refreshToken, {
    httpOnly: true,
    maxAge: 31 * 24 * 3600,
  });

  return res.status(200).json({ accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["JWT-REFRESH-TOKEN"] || null;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );

  await user.save();

  res.clearCookie("JWT-REFRESH-TOKEN", { httpOnly: true });

  return res.sendStatus(204);
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["JWT-REFRESH-TOKEN"] || null;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ refreshTokens: refreshToken });

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
  if (!user || user.email !== decoded.email) {
    res.clearCookie("JWT-REFRESH-TOKEN",{httpOnly: true});
    res.status(403);
    throw new Error("Forbidden");
  }
  const payload = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: 30 * 60,
  });
  const newRefreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "31d" }
  );
  user.refreshTokens = user.refreshTokens.map((token) =>
    token === refreshToken ? newRefreshToken : token
  );

  await user.save();
  res.cookie("JWT-REFRESH-TOKEN", newRefreshToken, {
    httpOnly: true,
    maxAge: 31 * 24 * 3600,
  });
  return res.status(200).json({ accessToken });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
};
