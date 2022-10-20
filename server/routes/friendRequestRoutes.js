const express = require("express");
const router = express.Router();

const friendRequestController = require("../controllers/friendRequestController");
const { protect } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(protect, friendRequestController.getRequests)
  .post(protect, friendRequestController.addRequest);

router
  .route("/:id")
  .delete(protect, friendRequestController.deleteRequest);
  // .put(protect, friendRequestController.acceptRequest);

module.exports = router;
