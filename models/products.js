const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: String,
    price: Number,
    quantity: Number,
    description: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);":"

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
