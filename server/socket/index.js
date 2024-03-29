const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
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
    // join private chat room
    socket.join(socket.userId);

    // get user
    const user = await User.findById(socket.userId).populate("friends");
    if (!user) {
      socket.emit("socket-error", { message: "User Not Found" });
      socket.disconnect();
    }

    // set connected to true
    user.connected = true;
    await user.save();

    user.friends.forEach((friend) => {
      socket.to(friend.id).emit("user connected", socket.userId);
    });

    // register private messages events
    privateMessagesEvents(io, socket);
  });

  return httpServer;
};

module.exports = init;
