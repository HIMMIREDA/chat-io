const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add an name"],
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
        default: []
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User",userSchema);