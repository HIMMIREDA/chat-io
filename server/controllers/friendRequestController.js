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
  if (await Friendrequest.exists({ to: friendId })) {
    return res.status(200).json({ message: "a friend request already exists" });
  }

  // check if the user want send the request to himself or a user which is already a friend with him
  const isAlreadyFriend = [...user.friends, user.id].find(
    (userId) => userId.toString() === friendId.toString()
  );

  if (isAlreadyFriend) {
    res
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
  const id = req.params.id || null;

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!id) {
    res.status(400);
    throw new Error("Bad request");
  }

  const friendReq = await Friendrequest.findById(id);
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
    _id: friendReq.id,
  });
});

module.exports = {
  getRequests,
  addRequest,
  deleteRequest,
};
