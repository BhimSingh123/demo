const express = require("express");
const Event = require("../models/event_model");

// Create a new event
const createEvent = async (req, res) => {
  try {
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      location: req.body.location,
      pictures: req.body.pictures || [], // Optional pictures array
      videos: req.body.videos || [], // Optional videos array
    });
    await event.save();
    res
      .status(201)
      .json({
        status: true,
        message: "Event created successfully",
        event: event,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res
      .status(200)
      .json({
        status: true,
        message: "Events fetched successfuly",
        event: events,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get an event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ status: false, message: "Event not found" });
    res
      .status(200)
      .json({
        status: true,
        message: "Event fetched successfuly",
        event: event,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an event by ID
const updateEvents = async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      location: req.body.location,
      pictures: req.body.pictures,
      videos: req.body.videos,
    };

    const event = await Event.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!event)
      return res
        .status(404)
        .json({ status: false, message: "Event not found" });
    res
      .status(200)
      .json({
        status: true,
        message: "Event updated successfully",
        event: event,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res.status(404).json({ staus: false, message: "Event not found" });
    res
      .status(200)
      .json({ status: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvents,
  deleteEvent,
};
