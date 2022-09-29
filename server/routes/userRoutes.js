const express = require("express");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

router.get("/refresh", userController.refreshToken);

router.get("/me", protect, userController.getMe);

module.exports = router;
