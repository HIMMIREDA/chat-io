const express = require("express");

const router = express.Router({ mergeParams: true });

const userController = require("../controllers/userController");

router.post("/",userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/logout",userController.logoutUser);

router.get("/refresh",userController.refreshToken);

router.get("/me",userController.logoutUser);


module.exports = router;