const Product = require("../models/Product.js");
const ProductOperations = require("../utils/productOperations.js");

//db queries
//CRUD Operations

//get
const getProducts = async (req, res) => {
  const itemPerPage = 10;
  try {
    let productOperation = new ProductOperations(Product.find(), req.query)
      .search()
      .filter()
      .pagination(itemPerPage);
    const product = await productOperation.query;
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
const getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//post
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//put
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ); // extra parametre aldı, neden ?????
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const typeByCount = async (req, res) => {
  try {
    const telephone = await Product.countDocuments({ category: "telephone" });
    const television = await Product.countDocuments({ category: "television" });
    res.status(200).json([
      {
        category: "telephone",
        count: telephone,
      },
      { category: "television", count: television },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  typeByCount,
};
