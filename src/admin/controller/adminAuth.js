const jwt = require("jsonwebtoken");
const Admin = require("../models/admin_model"); // Adjust the path as necessary
const SECRET_KEY = process.env.SECRET_KEY;

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Email and password are required" });
  }

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin }, // Payload
      SECRET_KEY, // Secret key
      { expiresIn: "1 h" } // Token expiration
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = { loginAdmin };
