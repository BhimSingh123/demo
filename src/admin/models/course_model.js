const mongoose = require("mongoose");


// Course Schema for storing basic course information
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number },
  instructor: { type: String, required: true },
  courseImg: { type: String }, // For banner image path
  price: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  enrolledStd: { type: Number, default: 0 }, // Set a default value
  lessons: [
    { type: String, required: true },
  ], // Referencing lesson objects
  createdAt: { type: Date, default: Date.now },
});







// Define CourseDetail Schema
// Define schema for course details
const courseDetailSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseName: [
    {
      name: { type: String, required: true },
      videoLink: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});



const CourseDetail = mongoose.model("CourseDetail", courseDetailSchema);
const Course = mongoose.model("Course", courseSchema);
module.exports = { Course, CourseDetail };
