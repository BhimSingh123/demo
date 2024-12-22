const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const routes = require("./routes");
const profileRoutes = require("./user/profile/user_routes"); // Adjusted path
const path = require("path");

const app = express();
const PORT =  8000;

// Fetch data from env
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json({ limit: "10mb" })); // Increase as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // For form-data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Connect to MongoDB
const uri =  "mongodb+srv://sainibhimsingh2001:bss%408875%211234@earnvidya.snbntnh.mongodb.net/?retryWrites=true&w=majority&appName=earnvidya";
if (!uri) {
  console.error("MongoDB URI is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api", routes);
app.use("/api", profileRoutes); // Use profileRoutes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).json({ status: false, message: "Route not found" });
});
