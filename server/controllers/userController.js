// @TODO: optimise db queries

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Friendrequest = require("../models/friendRequestModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("../validators/validate");

// @desc : register user
// @route: POST /api/users
// @access: Public

const registerUser = asyncHandler(async (req, res, next) => {
  let { username, email, password } = req.body;
  username = username ? username.trim() : null;
  email = email ? email.trim() : null;
  password = password ? password.trim() : null;
  if (!username || !email || !password) {
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
  // check if username exists
  if (await User.exists({ username })) {
    res.status(400);
    throw new Error(`a User with ${username} already exists`);
  }

  const hanshedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, username, password: hanshedPassword });
  await user.save();
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
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
    expires: new Date(Date.now() + 31 * 24 * 3600 * 1000),
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
    accessToken,
  });
});

// @desc : login user
// @route: POST /api/users/login
// @access: Public
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
    username: user.username,
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
    expires: new Date(Date.now() + 31 * 24 * 3600 * 1000),
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
    accessToken,
  });
});

// @desc : logout user
// @route: POST /api/users/logout
// @access: Public
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

  res.clearCookie("JWT-REFRESH-TOKEN", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.sendStatus(204);
});

// @desc : refresh accessToken with the refreshToken stored in cookie
// @route: GET /api/users/refresh
// @access: Private
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["JWT-REFRESH-TOKEN"] || null;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ refreshTokens: refreshToken });

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
  if (!user || user.email !== decoded.email) {
    res.clearCookie("JWT-REFRESH-TOKEN", { httpOnly: true });
    res.status(403);
    throw new Error("Forbidden");
  }
  const payload = {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: 30 * 60,
  });

  // @TODO: add regenerate new refresh token and solve race conditions problems
  // replace old refresh token with new one
  // const newRefreshToken = jwt.sign(
  //   payload,
  //   process.env.JWT_REFRESH_SECRET_KEY,
  //   { expiresIn: 31 * 24 * 3600 }
  // );
  // user.refreshTokens = user.refreshTokens.map((token) =>
  //   token === refreshToken ? newRefreshToken : token
  // );

  // await user.save();
  // res.cookie("JWT-REFRESH-TOKEN", newRefreshToken, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 31 * 24 * 3600 * 1000),
  //   secure: true,
  //   sameSite: "none",
  // });

  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
    accessToken,
  });
});

// @desc : get current user infos
// @route: GET /api/users/me
// @access: Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
});

// @desc : get current user friends
// @route: GET /api/users/friends
// @access: Private

const getFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  const results = {};

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  results.totalCount = user.friends.length;
  if (endIndex < user.friends.length) {
    results.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }

  const friends = user.friends.map((friend) => ({
    id: friend._id,
    username: friend.username,
  }));
  results.data = friends.slice(startIndex, endIndex);

  return res.status(200).json(results);
});

// @desc : get new Friends propositions for current user
// @route: GET /api/users/newfriends
// @access: Private

const getFriendsSuggestion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  let filter = req.query.filter || "";
  filter = filter.trim();

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }
  const pendingFriendRequests = await Friendrequest.find({
    $or: [{ from: user.id }, { to: user.id }],
  });

  const results = {};
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const newFriendsSuggestionCounts = await User.find({
    $and: [
      filter === "" ? {} : { username: new RegExp(`^.*${filter}.*$`, "gi") },
      {
        _id: {
          $nin: [
            ...user.friends,
            user._id,
            ...pendingFriendRequests.map((pendingReq) =>
              pendingReq.to.toString() === user.id.toString()
                ? pendingReq.from
                : pendingReq.to
            ),
          ],
        },
      },
    ],
  }).count();

  results.totalCount = newFriendsSuggestionCounts;

  const newFriendsSuggestion = await User.find({
    $and: [
      filter === "" ? {} : { username: new RegExp(`^.*${filter}.*$`, "gi") },
      {
        _id: {
          $nin: [
            ...user.friends,
            user._id,
            ...pendingFriendRequests.map((pendingReq) =>
              pendingReq.to.toString() === user.id.toString()
                ? pendingReq.from
                : pendingReq.to
            ),
          ],
        },
      },
    ],
  })
    .skip(startIndex)
    .limit(limit);
  if (endIndex < results.totalCount) {
    results.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }

  results.data = newFriendsSuggestion.map((newFriend) => ({
    id: newFriend._id,
    username: newFriend.username,
  }));

  return res.status(200).json(results);
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  getFriends,
  getFriendsSuggestion,
};
