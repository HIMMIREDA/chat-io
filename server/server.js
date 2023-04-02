require("dotenv").config();
require("./config/db").connectDB();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const server = require("./socket/index")(app);

// middlewares (i Enabled All CORS Requests in production , if you dont want to then replace this line with
// app.use(cors(require("./config/corsConfig")))
// and edit allowed origins in corsConfig.js )
app.use(
  process.env.NODE_ENV === "production"
    ? cors()
    : cors(require("./config/corsConfig"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// user routes
app.use("/api/users", require("./routes/userRoutes"));

// messages routes
app.use("/api/messages", require("./routes/messageRoutes"));

// friends routes
app.use("/api/friends", require("./routes/friendRoutes"));

// friend requests routes
app.use("/api/friendrequests", require("./routes/friendRequestRoutes"));

if (process.env.NODE_ENV === "production") {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    return res.sendFile("index.html", {
      root: path.join(__dirname, "../client/build"),
    });
  });
}

// error middleware
app.use(require("./middlewares/errorMiddleware"));

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
