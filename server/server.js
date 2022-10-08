require("dotenv").config();
require("./config/db").connectDB();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");



const app = express();
const server = require("./socket/index")(app);

// middlewares
app.use(cors(require("./config/corsConfig")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// user routes
app.use("/api/users", require("./routes/userRoutes"));


// messages routes
app.use("/api/messages", require("./routes/messageRoutes"));

// error middleware
app.use(require("./middlewares/errorMiddleware"));

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
