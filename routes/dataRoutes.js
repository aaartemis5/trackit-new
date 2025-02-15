const express = require("express");
const ResponseModel = require("../models/response");
const router = express.Router();

router.get("/get-events", async (req, res) => {
  try {
    const events = await ResponseModel.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

router.post("/add-event", async (req, res) => {
  try {
    const { userId, email, tableData } = req.body;
    if (!userId || !email || !tableData) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newEvent = new ResponseModel({ userId, email, tableData });
    await newEvent.save();
    res.status(201).json({ message: "Event stored successfully", data: newEvent });
  } catch (error) {
    console.error("Error storing event:", error);
    res.status(500).json({ message: "Error storing event", error: error.message });
  }
});

module.exports = router;
