const express = require("express");
const router = express.Router();

const friendRequestController = require("../controllers/friendRequestController");
const { protect } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(protect, friendRequestController.getRequests)
  .post(protect, friendRequestController.addRequest);

// router
//   .route("/:id")
//   .delete("/:id", protect, friendRequestController.deleteRequest)
//   .put("/:id", protect, friendRequestController.acceptRequest);

module.exports = router;
