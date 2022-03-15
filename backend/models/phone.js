const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  itemID: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model("Phone", phoneSchema);
