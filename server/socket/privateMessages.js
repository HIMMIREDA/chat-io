const { default: mongoose } = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

module.exports = (io, socket) => {
  const saveMessage = async ({ content, to, from }) => {
    try {
      return await Message.create({
        content,
        to,
        from,
      });
    } catch (error) {
      return false;
    }
  };

  socket.on("private-message", async ({ content, to }) => {
    const user = await User.findOne({ _id: socket.userId });
    const friend = await User.findById({ _id: to });
    if (
      !user ||
      !friend ||
      !user.friends.includes(mongoose.Types.ObjectId(to))
    ) {
      return;
    }

    const message = await saveMessage({ content, from: socket.userId, to });

    io.in(to)
      .in(socket.userId)
      .emit(
        "private-message",
        message
          ? {
              _id: message.id,
              content: message.content,
              seen: message.seen,
              createdAt: message.createdAt,
              from: {
                _id: user.id,
                username: user.username,
              },
              to: {
                _id: friend.id,
                username: friend.username,
              },
            }
          : {}
      );
  });

  socket.on("delete-friend", async ({ friendId }) => {
    const user = await User.findOne({ _id: socket.userId });
    const friend = await User.findById({ _id: friendId });
    if (!user || !friend) {
      return;
    }

    io.in(friendId).emit("delete-friend",socket.userId);
  });

  // socket.on("add-friend", async ({ friendId }) => {
  //   const friend = await User.findById({ _id: friendId });
  // });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).allSockets();

    // check if user closed all tabs that are connecting to chat room
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      console.log("a user just disconnected");
      // notify friends
      const user = await User.findById(socket.userId);
      if (!user) return;

      user.friends.forEach((friend) => {
        socket.to(friend.toString()).emit("user disconnected", socket.userId);
      });

      user.connected = false;
      await user.save();
    }
  });
};
