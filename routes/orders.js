const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { protect } = require("../middlewares/auth");

//Checkout API (CreateOrder)
router.post("/checkout", async (req, res) => {
  try {
    const { products, name, phoneNumber, address, email, amount } = req.body;

    if (!products || !name || !phoneNumber || !address || !email || !amount) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newOrder = new Order({
      products,
      name,
      phoneNumber,
      address,
      email,
      status: "pending",
      amount,
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully.", order: savedOrder });
    console.log("newOrder");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

//EditStatus API
router.put("/:orderId/edit", protect, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.status;

    if (!newStatus) {
      return res
        .status(400)
        .json({ message: "Missing status in request body." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

//OrderList API
router.get("/list", protect, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

//OrderDelete API
router.delete("/delete/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

module.exports = router;
