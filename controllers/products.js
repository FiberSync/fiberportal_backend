const Product = require("../models/products");

const addProduct = async (req, res) => {
  try {
    const { productName, description, unit, pricePerUnit, supplier, category, stockQuantity, reorderLevel, imageUrl, companyName, walletAddress } = req.body;

    // Ensure companyName and walletAddress are provided
    if (!companyName || !walletAddress) {
      return res.status(400).json({ message: "Company name and wallet address are required." });
    }

    const newProduct = new Product({
      productName,
      description,
      unit,
      pricePerUnit,
      supplier,
      category,
      stockQuantity,
      reorderLevel,
      imageUrl,
      companyName,
      walletAddress
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { companyName, walletAddress } = req.query;

    // Ensure both companyName and walletAddress are provided for filtering
    if (!companyName || !walletAddress) {
      return res.status(400).json({ message: "Company name and wallet address are required for filtering." });
    }

    const products = await Product.find({ companyName, walletAddress });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findByIdAndRemove(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const { productName, description, unit, pricePerUnit, supplier, category, stockQuantity, reorderLevel, imageUrl, companyName, walletAddress } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      productName,
      description,
      unit,
      pricePerUnit,
      supplier,
      category,
      stockQuantity,
      reorderLevel,
      imageUrl,
      companyName,
      walletAddress
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct
};
