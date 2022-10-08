const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const { getMessages } = require("../controllers/messageController");

router.route("/:friendId").get(protect, getMessages);

module.exports = router;
