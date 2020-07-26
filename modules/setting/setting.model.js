const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const SettingsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    is_public: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    collection: "settings",
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model("Settings", SettingsSchema);
