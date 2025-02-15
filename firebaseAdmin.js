// firebaseAdmin.js
const admin = require("firebase-admin");
require("dotenv").config();

// If FIREBASE_KEY is provided as an environment variable, parse it as JSON.
// Otherwise, fall back to requiring the local file (only for local development).
let serviceAccount;
if (process.env.FIREBASE_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  } catch (err) {
    console.error("Error parsing FIREBASE_KEY from environment:", err);
    process.exit(1);
  }
} else {
  // For local development, if you have the file
  serviceAccount = require("./firebase-key.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
