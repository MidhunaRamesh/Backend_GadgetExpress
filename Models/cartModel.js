const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);