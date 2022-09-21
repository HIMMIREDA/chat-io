const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI,{
      dbName: "chatDB"
    })
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(err.message));
};


module.exports = {
  connectDB
}