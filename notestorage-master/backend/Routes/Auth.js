const express = require("express");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

const UserSchema = require("../models/SignupModel");

const router = express.Router();

// Signup Route
router.post("/Register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    let existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Message: "Email Already Exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserSchema({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to database

    await newUser.save();



    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ Message: "User Created Successfully",token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: "Server Error", Error: error.message });
  }
});

module.exports = router;
