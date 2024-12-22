require("dotenv").config(); // Ensure you load .env variables
const mongoose = require("mongoose");
const Admin = require("../models/admin_model"); // Adjust path as needed
const bcrypt = require("bcryptjs");

// Connect to your database
const uri = process.env.MONGO_URI; // Use the MongoDB URI from your .env file
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.error("MongoDB connection error:", error));

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "adminstack24@stackearn.com",
    });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Create new admin with hashed password
    const hashedPassword = await bcrypt.hash("stackAdmin@24", 10);
    const newAdmin = new Admin({
      email: "adminstack24@stackearn.com",
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    // Close the connection after operation without a callback
    await mongoose.connection.close(); // Use await here
    console.log("MongoDB connection closed.");
  }
};

// Call the seeding function
seedAdmin();
