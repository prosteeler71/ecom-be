const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { protect } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

//UserList API
router.get("/list", protect, async (req, res) => {
  try {
    const allUsers = await User.find();
    console.log(allUsers);

    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//Register API
router.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ userName, password: hashedPassword });
    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//DeleteUser API
router.delete("/:id", protect, async (req, res) => {
  const userIdToDelete = req.params.id;

  try {
    const userToDelete = await User.findById(userIdToDelete);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: userIdToDelete });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//Login API
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_token, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

//Logout API

module.exports = router;
