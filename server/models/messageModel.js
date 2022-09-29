const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000,
      validate: [notEmpty, "message cant be empty"],
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

function notEmpty(value) {
  return value.trim() !== "";
}

module.exports = mongoose.model("Message", messageSchema);
