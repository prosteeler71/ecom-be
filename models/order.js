const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [],
  name: String,
  phoneNumber: Number,
  address: String,
  email: String,
  status: String,
  amount: String,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
