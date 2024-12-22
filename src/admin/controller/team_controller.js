const MyTeam = require("../models/team_model"); // Ensure the path is correct
const path = require("path");
const fs = require("fs");
const upload = require("../middlewares/upload");

// CREATE TEAM
const createTeam = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err); // Log the error
      return res
        .status(500)
        .json({ status: false, message: "File upload error" });
    }
    console.log("Uploaded file:", req.file); // Log the uploaded file
    const { name, designation, links } = req.body;
    const teamImage = req.file ? req.file.filename : ""; // Check if the file was uploaded

    // Log team data for debugging
    console.log("Team data:", {
      name,
      designation,
      links,
      teamImage,
    });

    // Check for empty values in fields
    if (!name || !designation || !links) {
      return res.status(400).json({
        status: false,
        message: "All fields (name, designation, links, image) are required",
      });
    }

    const linksArray = Array.isArray(links) ? links : [links];

    try {
      const teamData = {
        name,
        designation,
        teamImage,
        links: linksArray,
      };
      const myTeam = new MyTeam(teamData);
      await myTeam.save();
      res
        .status(201)
        .json({
          status: true,
          message: "Team created successfully",
          team: myTeam,
        });
    } catch (error) {
      console.error("Error creating team:", error); // Log the error for debugging
      res.status(500).json({ status: false, message: "Server error" });
    }
  });
};

// GET ALL TEAM MEMBERS
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMember = await MyTeam.find({});
    
    if (teamMember.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No team members found!",
      });
    }

    res.json({
      status: true,
      message: "Get all team members successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Error retrieving team members:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


/// DELETE TEMS MEBERS
const deleteMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await MyTeam.findByIdAndDelete(id);
    if (!member) {
      return res
        .status(404)
        .json({ status: false, message: "Team Member not found" });
    }
    res.json({ status: true, message: "Team Member deleted successfully" });
  } catch (error) { 
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// UPADTE TEAM INFORMAION BY ID
const updateMemberById = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "File upload error" });
    }

    try {
      const members = await MyTeam.findById(req.params.id);
      if (!members) {
        return res
          .status(404)
          .json({ status: false, message: "Memeber not found" });
      }

      // Extract fields from request body
      const { name, designation, links } =
        req.body;

      // Update members fields
      members.name = name || members.name;
      members.designation = designation || members.designation;
      members.links = links || members.links;


      // Update image URL if a new file is uploaded
      if (req.file) {
        members.imageUrl = req.file.filename;
      }

      await members.save();
      res.json({
        status: true,
        message: "Members updated successfully",
        members,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: "Server error" });
    }
  });
};




module.exports = {
  createTeam,
  getAllTeamMembers,
  deleteMemberById,
  updateMemberById,
};
