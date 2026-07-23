const Popup = require("../models/Popup");

// Get popup configuration
const getPopup = async (req, res) => {
  try {
    let popup = await Popup.findOne().populate(
      "categoryId",
      "name examMode hideScore requireRegistration"
    );

    // Create default popup if none exists
    if (!popup) {
      popup = await Popup.create({});
    }

    res.json(popup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update popup configuration
const updatePopup = async (req, res) => {
  try {
    let popup = await Popup.findOne();

    if (!popup) {
      popup = await Popup.create(req.body);
    } else {
      Object.assign(popup, req.body);
      await popup.save();
    }

    const updatedPopup = await Popup.findById(popup._id).populate(
      "categoryId",
      "name examMode hideScore requireRegistration"
    );

    res.json(updatedPopup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Enable / Disable popup
const togglePopup = async (req, res) => {
  try {
    let popup = await Popup.findOne();

    if (!popup) {
      popup = await Popup.create({
        enabled: req.body.enabled ?? false,
      });
    } else {
      popup.enabled = req.body.enabled;
      await popup.save();
    }

    res.json({
      success: true,
      enabled: popup.enabled,
      message: popup.enabled
        ? "Popup enabled successfully."
        : "Popup disabled successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPopup,
  updatePopup,
  togglePopup,
};