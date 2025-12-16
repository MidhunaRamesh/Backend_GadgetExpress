const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(cors());

// --- ROUTES IMPORT ---
const signupRouter = require("./Routers/signupRouter");
const contactRouter = require("./Routers/contactRouter");

// --- ROUTES SETUP ---
app.use("/api/signup", signupRouter);
app.use("/api/contact", contactRouter);

// --- MONGODB CONNECTION ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
