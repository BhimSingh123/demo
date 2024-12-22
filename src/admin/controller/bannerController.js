const Banner = require('../models/banner_model');
const path = require('path');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = require("../middlewares/upload");

// Create a new banner
const createBanner = async (req, res) => {
  try {
    // Use multer to handle single file upload
   upload(req, res, async (err) => {
     if (err) {
       console.error("File upload error:", err); // Log the error
       return res
         .status(500)
         .json({ status: false, message: "File upload error" });
     }

     const { title, description } = req.body;
     const imageUrl = req.file ? req.file.filename : "";

     // Validate required fields
     if (!title) {
       return res.status(400).json({
         status: false,
         message: "Title are required",
       });
     }

     // Create banner object and save to database
     const bannerData = { title, description, imageUrl };
     const banner = new Banner(bannerData);
     await banner.save();

     // Return success response with banner details
     return res.status(201).json({
       status: true,
       message: "Banner created successfully",
       banner,
     });
   });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating banner:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json({ status: true, message: "Banners retrieved successfully", banners });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Get a banner by ID
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ status: false, message: 'Banner not found' });
    }
    res.json({ status: true, banner });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Update a banner by ID
const updateBannerById = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'File upload error' });
    }

    try {
      const banner = await Banner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ status: false, message: 'Banner not found' });
      }

      // Update the banner fields
      banner.title = req.body.title || banner.title;
      banner.description = req.body.description || banner.description;
      
      // Update the image URL if a new file is uploaded
      if (req.file) {
        banner.imageUrl = req.file.filename;
      }

      await banner.save();
      res.json({ status: true, message: "Banner updated successfully", banner });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Server error' });
    }
  });
};
// Delete a banner by ID
const deleteBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ status: false, message: 'Banner not found' });
    }
    res.json({ status: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

module.exports = { createBanner, getAllBanners, getBannerById, updateBannerById, deleteBannerById };
