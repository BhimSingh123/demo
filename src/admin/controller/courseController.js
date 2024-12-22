const { Course, CourseDetail, Lesson } = require("../models/course_model"); // Ensure the path is correct
const path = require("path");
const fs = require("fs");
const upload = require("../middlewares/upload");

// Create a new course with image upload
const createCourse = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err); // Log the error
      return res
        .status(500)
        .json({ status: false, message: "File upload error" });
    }

    const {
      title,
      description,
      rating,
      instructor,
      price,
      enrolledStd,
      purchasePrice,
      lessons,
    } = req.body;

    const courseImg = req.file ? req.file.filename : ""; // Handle uploaded image

    // Check for required fields
    if (
      !title ||
      !description ||
      !rating ||
      !instructor ||
      !price ||
      !enrolledStd ||
      !purchasePrice ||
      !lessons
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const lessonsArray = Array.isArray(lessons) ? lessons : [lessons];

    try {
      const courseData = {
        title,
        description,
        instructor,
        courseImg, // Save image file
        price,
        rating,
        enrolledStd,
        purchasePrice,
        lessons: lessonsArray,
      };

      const course = new Course(courseData);
      await course.save();

      res.status(201).json({
        status: true,
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      console.error("Error creating course:", error); // Log error
      res.status(500).json({ status: false, message: "Server error" });
    }
  });
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      status: true,
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ status: false, message: "Course not found" });
    }
    res.status(200).json({
      status: true,
      message: "Course retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Update a course by ID
const updateCourseById = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "File upload error" });
    }

    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res
          .status(404)
          .json({ status: false, message: "Course not found" });
      }

      const {
        title,
        description,
        rating,
        enrolledStd,
        instructor,
        price,
        purchasePrice, // Ensure purchasePrice is handled
        duration,
        lessons,
      } = req.body;

      // Ensure that the `lessons` field is an array of ObjectIds
      // const lessonsArray = Array.isArray(lessons) ? lessons : [lessons];

      course.title = title || course.title;
      course.description = description || course.description;
      course.rating = rating || course.rating;
      course.enrolledStd = enrolledStd || course.enrolledStd;
      course.instructor = instructor || course.instructor;
      course.price = price || course.price;
      course.purchasePrice = purchasePrice || course.purchasePrice;
      course.duration = duration || course.duration;
      course.lessons = lessons || course.lessons;

      if (req.file) {
        course.courseImg = req.file.filename; // Handle image update
      }

      await course.save();
      res.status(200).json({
        status: true,
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ status: false, message: "Server error" });
    }
  });
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ status: false, message: "Course not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Add or update course details by course ID
const addCourseDetails = async (req, res) => {
  const { courseId, courseName } = req.body;

  try {
    // Validate input
    if (!courseId || !Array.isArray(courseName)) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Course ID and course names are required",
        });
    }

    // Create a new course detail document
    const courseDetail = new CourseDetail({
      courseId,
      courseName,
    });

    // Save the course detail to the database
    await courseDetail.save();

    res.status(201).json({
      status: true,
      message: "Course details added successfully",
      courseDetail,
    });
  } catch (error) {
    console.error("Error adding course details:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};



// GET COURSE DETAILS BY ID
const getCourseDetailsById = async (req, res) => {
  const { courseId } = req.params; // Get course ID from parameters

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: false, message: "Course not found" });
    }

    // Fetch course details based on courseId
    const courseDetails = await CourseDetail.find({ courseId });

    // Prepare response structure
    const lessonsArray = [];
    courseDetails.forEach((detail) => {
      detail.courseName.forEach((lesson) => {
        lessonsArray.push({ name: lesson.name, videoLink: lesson.videoLink });
      });
    });

    res.status(200).json({
      status: true,
      course: [
        {
          title: course.title,
          courseName: lessonsArray,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};








// Exporting all controllers
module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  addCourseDetails,
  getCourseDetailsById,
};
