const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const privateMessagesEvents = require("./privateMessages");

const init = (app) => {
  const httpServer = require("http").createServer(app);
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.use(async (socket, next) => {
    const { token } = socket.handshake.auth;
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
      if (!(await User.exists({ email: decoded.email }))) {
        next(new Error("User Not Found"));
      }

      socket.username = decoded.username;
      socket.userId = decoded.id;

      next();
    } catch (e) {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("A user joined just now");
    // join private chat room
    socket.join(socket.userId);

    // get user
    const user = await User.findById(socket.userId).populate("friends");
    if (!user) {
      io.emit("socket-error", { message: "User Not Found" });
    }

    // set connected to true
    user.connected = true;
    await user.save();

    let friends = [];
    for (const friend of user.friends) {
      const lastMessage = await Message.aggregate([
        {
          $match: {
            $or: [
              { from: friend.id, to: socket.userId },
              { from: socket.userId, to: friend.id },
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

      console.log(lastMessage);

      const unseenMessagesCount = await Message.find({
        $and: [
          {
            from: friend.id,
            to: socket.userId,
          },
          { seen: false },
        ],
      }).count();

      friends.push({
        id: friend.id,
        connected: friend.connected,
        username: friend.username,
        lastMessage,
        unseenMessagesCount,
      });
    }

    // send to the connected user list of friends with last message and count of unseen messages
    socket.emit("friends", friends);

    user.friends.forEach((friend) => {
      socket.to(friend.id).emit("user connected", socket.userId);
    });

    // register private messages events
    privateMessagesEvents(io, socket);
  });

  return httpServer;
};

module.exports = init;
