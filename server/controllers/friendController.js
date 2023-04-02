// @TODO optimise db queries

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");
const Friendrequest = require("../models/friendRequestModel");

// @desc : get friends details (unseen messages count + last Message + username + status)
// @route: GET /api/friends/details
// @access: Private

const getFriendsDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends");
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  let friends = [];
  for (const friend of user.friends) {
    const lastMessage = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              from: mongoose.Types.ObjectId(friend.id),
              to: mongoose.Types.ObjectId(user.id),
            },
            {
              from: mongoose.Types.ObjectId(user.id),
              to: mongoose.Types.ObjectId(friend.id),
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const unseenMessagesCount = await Message.find({
      $and: [
        {
          from: friend.id,
          to: user.id,
        },
        { seen: false },
      ],
    }).count();

    friends.push({
      id: friend.id,
      connected: friend.connected,
      username: friend.username,
      lastMessage: lastMessage && lastMessage[0],
      unseenMessagesCount,
    });
  }
  return res.status(200).json(friends);
});

// @desc : get current user friends
// @route: GET /api/friends
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
// @route: GET /api/friends/newfriends
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

// @desc delete a friend
// @route DELETE /api/friends/:id
// @access Private

const deleteFriend = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const friendId = req.params.id;

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!friendId) {
    res.status(400);
    throw new Error("Bad request");
  }

  const friend = await User.findById(friendId);

  // delete friend from current user friendslist
  user.friends = user.friends.filter(
    (friend) => friend.toString() !== friendId.toString()
  );
  await user.save();

  // delete the current user from the friend friendlist
  friend.friends = friend.friends.filter(
    (friendId) => friendId.toString() !== user.id.toString()
  );
  await friend.save();

  return res.status(200).json({
    id: friendId,
  });
});

module.exports = {
  getFriendsDetails,
  getFriends,
  getFriendsSuggestion,
  deleteFriend,
};
