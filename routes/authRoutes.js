const express = require("express");
const admin = require("../firebaseAdmin"); // Firebase Admin SDK, properly initialized
const User = require("../models/user");
const ResponseModel = require("../models/response");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;
  console.log("🔹 Received Token:", token);

  try {
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Verify the token using Firebase Admin SDK (this should be the Firebase ID token)
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Token verified with Firebase Admin - Payload:", decodedToken);

    // Check if user exists; if not, create one
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      user = new User({
        googleId: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split("@")[0],
        profilePic: decodedToken.picture,
      });
      await user.save();
      console.log("✅ New User Created:", user);
    } else {
      console.log("✅ Existing User Found:", user);
    }

    // Optionally process OpenAI here if desired, but that might be separate.
    res.status(200).json({
      message: "User authenticated successfully",
      user: decodedToken,
    });
  } catch (error) {
    console.error("❌ Authentication Error:", error.stack || error.message);
    res.status(500).json({ message: "Authentication error", error: error.message });
  }
});

module.exports = router;
