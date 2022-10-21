// @TODO: optimise db queries

const Friendrequest = require("../models/friendRequestModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @des get current users friend requests from other users
// @route GET /api/friendrequests
// @access private
const getRequests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const friendRequests = await Friendrequest.find({ to: user.id }).populate(
    "from"
  );

  return res.status(200).json(
    friendRequests.map((friendRequest) => ({
      id: friendRequest.id,
      from: {
        id: friendRequest.from._id,
        username: friendRequest.from.username,
      },
    }))
  );
});

// @des send friend request from current user to another user
// @route POST /api/friendrequests/:friendId
// @access private

const addRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { friendId } = req.body;
  let friend = null;

  if (friendId) {
    friend = await User.findById(friendId);
  }
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!friendId) {
    res.status(400);
    throw new Error("Bad request");
  }

  //  check if request exists already
  if (await Friendrequest.exists({$or:[{ to: friendId, from: user.id },{to: user.id, from: friendId}]})) {
    return res.status(200).json({ message: "a friend request already exists" });
  }

  // check if the user want send the request to himself or a user which is already a friend with him
  const isAlreadyFriend = [...user.friends, user.id].find(
    (userId) => userId.toString() === friendId.toString()
  );

  if (isAlreadyFriend) {
    return res
      .status(200)
      .json({ message: `user with id : ${friendId} is already your friend` });
  }

  const friendRequest = await Friendrequest.create({
    from: user.id,
    to: friendId,
  });

  return res.status(201).json({
    id: friendRequest.id,
    to: {
      id: friend.id,
      username: friend.username,
    },
  });
});

// @desc delete a friend request (this action can be done by only by the receiver of friend request)
// @route DELETE /api/friendrequests/:id
// @access Private
const deleteRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const requestId = req.params.id || null;

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!requestId) {
    res.status(400);
    throw new Error("Bad request");
  }

  const friendReq = await Friendrequest.findById(requestId);
  if (!friendReq) {
    res.status(404);
    throw new Error("Not Found");
  }

  if (user.id.toString() !== friendReq.to.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  await Friendrequest.deleteOne({ _id: friendReq.id });

  return res.status(200).json({
    id: requestId,
  });
});

// @desc accept an incoming friend request (this action can only be done by the receiver of friend request)
// @route PUT /apI/friendrequests/:id
// @access Private

const acceptRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const requestId = req.params.id || null;

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!requestId) {
    res.status(400);
    throw new Error("Bad request");
  }

  const friendReq = await Friendrequest.findById(requestId);
  if (!friendReq) {
    res.status(404);
    throw new Error("Not Found");
  }

  if (user.id.toString() !== friendReq.to.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // get the sender of the friend request
  const friend = await User.findById(friendReq.from);
  if (!friend) {
    res.status(404);
    throw new Error("cant add the sender of friendrequest as a friend");
  }
  // accept the sender of friend request as a friend
  user.friends.push(friendReq.from);
  friend.friends.push(user.id);
  await user.save();
  await friend.save();

  // delete the friend request
  await Friendrequest.deleteOne({ _id: requestId });

  return res.status(200).json({
    id: requestId,
  });
});

module.exports = {
  getRequests,
  addRequest,
  deleteRequest,
  acceptRequest,
};
