const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friendController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, friendController.getFriends);
router.get("/newfriends", protect, friendController.getFriendsSuggestion);
router.delete("/:id", protect, friendController.deleteFriend);


module.exports = router;
