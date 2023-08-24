const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// Contact Page API
router.post("/message", async (req, res) => {
  try {
    const { email, message } = req.body;

    const newContact = new Contact({
      email,
      message,
    });

    const savedContact = await newContact.save();

    res.json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while processing the contact form.",
    });
  }
});

// GET CONTACT API
router.get("/messages", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({ contacts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching contact messages." });
  }
});

module.exports = router;
