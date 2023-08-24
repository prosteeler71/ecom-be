const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Routers

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const productRouter = require("./routes/products");
app.use("/products", productRouter);

const orderRouter = require("./routes/orders");
app.use("/orders", orderRouter);

const contactRouter = require("./routes/contact");
app.use("/contact", contactRouter);

//PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
