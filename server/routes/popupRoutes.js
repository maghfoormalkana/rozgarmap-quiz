const express = require("express");
const router = express.Router();

const {
  getPopup,
  updatePopup,
} = require("../controllers/popupController");

// Get popup configuration
router.get("/", getPopup);

// Create / Update popup configuration
router.put("/", updatePopup);

module.exports = router;