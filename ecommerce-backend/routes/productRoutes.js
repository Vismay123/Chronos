const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

const router = express.Router();

// Excel file path
const filePath = path.join(__dirname, "../products.xlsx");

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Helper functions to work with Excel
const getProducts = () => {
  if (!fs.existsSync(filePath)) return [];
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets["Products"];
  return xlsx.utils.sheet_to_json(sheet);
};

const saveProducts = (products) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(products);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
  xlsx.writeFile(workbook, filePath);
};

// ✅ GET all products
router.get("/", (req, res) => {
  try {
    const products = getProducts();
    res.json(products);
  } catch (err) {
    console.error("Error reading products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ POST add product
router.post("/", upload.single("image"), (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price required" });
    }

    // ✅ Convert uploaded file to full URL
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const products = getProducts();
    const newProduct = {
      id: Date.now(),
      name,
      price,
      image: imageUrl,
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ DELETE product (and remove image file if exists)
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let products = getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove image file from uploads folder
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(product.image)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Filter out the deleted product
    products = products.filter((p) => p.id !== id);
    saveProducts(products);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
