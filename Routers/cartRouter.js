const express = require("express");
const router = express.Router();
const { addToCart, getCartItems } = require("../Controllers/cartController");

// POST /api/cart/add - Add item to cart
router.post("/add", addToCart);

// GET /api/cart/:userId - Get cart items for user
router.get("/:userId", getCartItems);

module.exports = router;