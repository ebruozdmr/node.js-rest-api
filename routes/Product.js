const express = require("express");
const {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  typeByCount,
} = require("../controllers/Product.js");
// const auth = require("../middleware/Auth.js");
const { verifyAdmin } = require("../middleware/Auth.js");

const router = express.Router();

/* Sadece adminin yapması gereken istekler için auth middleware'ı kullanılır.
   Bu sayede token'ın geçerliliği kontrol edilerek kimlik doğrulaması yapılır. */
router.get("/products", getProducts);
router.get("/products/:id", getProductDetail);
router.get("/countProduct", typeByCount);
router.post("/product/new/", verifyAdmin, createProduct);
router.put("/updateProduct/:id", verifyAdmin, updateProduct);
router.delete("/deleteProduct/:id", verifyAdmin, deleteProduct);

module.exports = router;
