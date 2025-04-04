import express from "express";
import User from "../models/User.js";
import {
  validateLogin,
  validateRegister,
} from "../midellwares/authValidation.js";
import handleValidationErrors from "../midellwares/handleValidationErrors.js";
const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json("User registered successfully!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json("User not found");
      const isValid = user.validatePassword(password);
      if (!isValid) return res.status(401).json("Invalid password");
      res.status(200).json("Login successful!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
export default router;
