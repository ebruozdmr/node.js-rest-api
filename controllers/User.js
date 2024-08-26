const Auth = require("../models/Auth");

const getUsers = async (req, res) => {
  try {
    const users = await Auth.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const detailUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await Auth.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await Auth.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getUsers, detailUser, updateUser, deleteUser };
