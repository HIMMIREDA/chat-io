require("dotenv").config();
require("./config/db").connectDB();
const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// user routes
app.use("/api/users", require("./routes/userRoutes"));

app.use(require("./middlewares/errorMiddleware"));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
