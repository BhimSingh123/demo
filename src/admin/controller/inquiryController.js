const Inquiry = require("../models/inquiry_model");

// Create Inquiry
const createInquiry = async (req, res) => {
  try {
    const { name, email, mobile, subject } = req.body;

    if (!name || !email || !mobile || !subject) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const inquiry = new Inquiry({ name, email, mobile, subject });
    await inquiry.save();

    res
      .status(201)
      .json({ status: true, message: "Inquiry created successfully", inquiry });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


// Get all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();

    if (inquiries.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No inquiry found!",
      });
    }

    res.status(200).json({ status: true, inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
// Delete Inquiry
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ status: false, message: "Inquiry not found" });
    }

    await inquiry.deleteOne();
    res.status(200).json({ status: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = { createInquiry, getAllInquiries, deleteInquiry};