const User = require("../../user/user_model");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ status: true, message: "Get all users successfully", users });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.json({ status: true, message: "User retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = { getAllUsers, getUserById };
