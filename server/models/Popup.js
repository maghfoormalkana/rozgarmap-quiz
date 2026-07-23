const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["image", "content", "image-content"],
      default: "image-content",
    },

    image: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    ctaText: {
      type: String,
      trim: true,
      default: "Apply Now",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Popup", popupSchema);