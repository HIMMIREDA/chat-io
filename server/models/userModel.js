const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add a password"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
