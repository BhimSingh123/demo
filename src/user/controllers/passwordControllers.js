// /controllers/passwordController.js
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require('../user_model'); // Adjust the path as necessary

const bcrypt = require("bcryptjs");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "bhim00@gmail.com",
    pass: "123456",
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Set expiration time (e.g., 1 hour)
    const resetExpires = Date.now() + 3600000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await user.save();

    // Send email with the reset token
    const mailOptions = {
      to: user.email,
      from: "bhim00@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://localhost:8000/reset/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ status: true, message: "Password reset email sent success" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports = { forgotPassword , resetPassword};
