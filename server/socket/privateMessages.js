const { default: mongoose } = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

module.exports = (io, socket) => {
  const saveMessage = async ({ content, to, from }) => {
    try {
      await Message.create({
        content,
        to,
        from,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  socket.on("private-message", async ({ content, to }) => {
    const user = await User.findById(socket.userId);
    if (!user || !user.friends.includes(mongoose.Types.ObjectId(to))) return;

    const message = {
      content,
      to,
      from: socket.userId,
    };
    socket.to(to).to(socket.userId).emit("private-message", message);
    saveMessage(message);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).allSockets();

    // check if user closed all tabs that are connecting to chat room
    const isDisconnected = matchingSockets.size === 0;

    if (isDisconnected) {
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
