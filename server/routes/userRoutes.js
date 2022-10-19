const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

router.get("/newfriends",protect, userController.getFriendsSuggestion);

router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

router.get("/refresh", userController.refreshToken);

router.get("/me", protect, userController.getMe);

router.get("/friends",protect, userController.getFriends);


module.exports = router;
