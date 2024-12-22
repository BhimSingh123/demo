const express = require("express");
const { register, login } = require("./user/controllers/authController");
const passwordController = require("./user/controllers/passwordControllers");
const upload = require('./admin/middlewares/upload'); // Adjust path to your middleware
const verifyAdminToken = require("./admin/middlewares/authMiddleware"); // Admin authentication middleware
const {loginAdmin}  = require("./admin/controller/adminAuth"); // Adjust path as needed

const {
  getAllUsers,
  getUserById,
} = require("./admin/controller/userController");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  addCourseDetails,
} = require("./admin/controller/courseController");
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBannerById,
  deleteBannerById,
} = require("./admin/controller/bannerController");



const {
  createTeam,
  getAllTeamMembers,
  deleteMemberById,
  updateMemberById,
} = require("./admin/controller/team_controller");


const {
  createInquiry,
  getAllInquiries,
  deleteInquiry,
} = require("./admin/controller/inquiryController");



const {
  createEvent,
  getEvents,
  getEventById,
  updateEvents,
  deleteEvent,
} = require("./admin/controller/eventContoller");



const router = express.Router();

// ADMIN AUTH 
router.post("/v1/admin/login", loginAdmin);


// USERS SIDE ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/forgot_password", passwordController.forgotPassword); // Check route name here
router.post("/reset_password", passwordController.resetPassword); // Check route name here

//ADMIN SIDE ROUTES
router.get("/users", getAllUsers); // Define the route
router.get("/user/:id", getUserById); // Define the route
// COURSE ROUTES
router.post('/courses', createCourse);
router.get("/courses", getAllCourses); // Get all courses
router.get("/courses/:id", getCourseById); // Get a course by ID
router.put("/courses/:id", updateCourseById); // Update a course by ID
router.delete("/courses/:id", deleteCourseById); // Delete a course by ID
router.post("/courses/details", addCourseDetails); // Adjust path as needed

// BANNERS ROUTES
router.post("/banners", createBanner); // Create a new banner
router.get("/banners", getAllBanners); // Get all banners
router.get("/banners/:id", getBannerById); // Get a banner by ID
router.put("/banners/:id", updateBannerById); // Update a banner by ID
router.delete("/banners/:id", deleteBannerById); // Delete a banner by ID

// MY TEAM  ROUTES
router.post("/v1/admin/team/create", createTeam);
router.get("/v1/admin/team/members", getAllTeamMembers);
router.put("/v1/admin/team/members/:id", updateMemberById); // Update a banner by ID
router.delete("/v1/admin/team/members/:id", deleteMemberById); // Delete a banner by ID



router.post("/inquiry", createInquiry);// Route to create inquiry
router.get("/inquiry", getAllInquiries);// Route to get all inquiries
router.delete('/inquiry/:id', deleteInquiry);// Route to delete inquiry by ID


router.post('/v1/admin/ceate/event', createEvent); // create events
router.get("/v1/event", getEvents); // Get all events
router.get("/v1/event/:id", getEventById); // Get a events by ID
router.put("/v1/admin/update/event/:id", updateEvents); // Update a events by ID
router.delete("/v1/admin/delete/event/:id", deleteEvent); // Delete a events by ID

module.exports = router;
