// @TODO: optimise db queries

const User = require("../models/userModel");
const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");

const getMessages = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const user = await User.findById(req.user.id).populate("friends");

  //   check user exists
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const friend = user.friends.find(
    (friend) => friend.id.toString() === friendId.toString()
  );

  if (!friend) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const results = {};
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (
    endIndex <
    (await Message.countDocuments({
      $or: [
        { from: friendId, to: req.user.id },
        { from: req.user.id, to: friendId },
      ],
    }))
  ) {
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

  results.data = await Message.find({
    $or: [
      { from: friendId, to: req.user.id },
      { from: req.user.id, to: friendId },
    ],
  })
    .select("-updatedAt")
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate({ path: "from", select: "_id username" })
    .populate({ path: "to", select: "_id username" });

  return res.status(200).json(results);
});

module.exports = {
  getMessages,
};
