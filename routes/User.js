const express = require("express");
const {
  getUsers,
  detailUser,
  updateUser,
  deleteUser,
} = require("../controllers/User.js");
const { verifyUser, verifyAdmin } = require("../middleware/Auth.js");

const router = express.Router();

router.get("/users", verifyAdmin, getUsers);
router.get("/detailUser/:id", verifyUser, detailUser);
router.put("/updateUser/:id", verifyUser, updateUser);
router.delete("/deleteUser/:id", verifyUser, deleteUser);

module.exports = router;
