const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const { protect } = require("../middlewares/auth");

//productAdd API
router.post("/add", protect, async (req, res) => {
  try {
    const { title, price, quantity, description, imageUrl } = req.body;

    const existingProduct = await Product.findOne({ title });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with the same title already exists" });
    }

    const newProduct = new Product({
      title,
      price,
      quantity,
      description,
      imageUrl,
    });

    const savedProduct = await newProduct.save();
    console.log(savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//productEdit API
router.put("/edit/:productId", protect, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { title, price, quantity, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        price,
        quantity,
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//productDelete API
router.delete("/delete/:productId", protect, async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Deleted product:", deletedProduct);
    res.status(200).json({ message: "Product Deleted successfully" }); // No content response
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// productList API
router.get("/list", async (req, res) => {
  try {
    const allProducts = await Product.find();
    console.log(allProducts);

    res.status(200).json(allProducts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// GETID request to fetch products
router.get("/:_id", async (req, res) => {
  try {
    const productId = req.params._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productDetails = {
      title: product.title,
      price: product.price,
      Quantity: product.Quantity,
      Description: product.Description,
      imageUrl: product.imageUrl,
    };

    res.status(200).json(productDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
