const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // Make sure to set this in your .env file

const verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ status: false, message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized access!" });
    }

    if (!decoded.isAdmin) {
      // Ensure only admins can proceed
      return res.status(403).json({ status: false, message: "Access denied!" });
    }

    // Proceed if the user is admin
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyAdminToken;
