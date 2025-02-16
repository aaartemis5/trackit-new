// services/geminiaiservice.js
const axios = require('axios');
const sleep = require('util').promisify(setTimeout);

// Rate limiting: 3 requests per minute for free-tier usage.
const RPM_LIMIT = 3;
let requestCount = 0;
let requestStartTime = Date.now();

// Set your Gemini model here (you can change this to gemini-2.0-flash if available)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
// Gemini API base URL
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function processEmailWithGemini(emailData) {
  // Updated prompt with strict instructions
  const prompt = `
Extract the following details from the email:
- Event Name (if any)
- Event Date or Deadline
- Additional event details

Email Data:
Subject: ${emailData.subject}
From: ${emailData.from}
Date: ${emailData.date}
Snippet: ${emailData.snippet}
Return strictly valid JSON in the following format (use null **without quotes** for missing fields):
{
  "eventName": "Event Name or null",
  "eventDate": "Event Date or null",
  "deadline": "Deadline or null",
  "details": "Additional Details or null"
}
Do not include any markdown formatting, explanations, or extra text.
  `;
  
  console.log("Sending prompt to Gemini:", prompt);
  await handleRateLimit();
  
  try {
    const url = `${GEMINI_BASE_URL}?key=${process.env.GEMINI_API_KEY}`;
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      console.error("Invalid Gemini API response:", response.data);
      return {};
    }
    
    // Extract raw output; also remove any markdown/code fences if present
    let rawOutput = response.data.candidates[0]?.content?.parts[0]?.text || "";
    rawOutput = rawOutput.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    console.log("Raw Gemini output:", rawOutput);
    
    let structuredData;
    try {
      structuredData = JSON.parse(rawOutput);
    } catch (jsonError) {
      console.error("JSON parse error in Gemini output. Raw output:", rawOutput);
      return {};
    }
    
    // Post-process: Convert string "null" values to actual null.
    for (const key in structuredData) {
      if (typeof structuredData[key] === 'string' && structuredData[key].toLowerCase() === "null") {
        structuredData[key] = null;
      }
    }
    
    return structuredData;
  } catch (error) {
    console.error("Error processing email with Gemini:", error.response?.data || error.message);
    return {};
  }
}

async function handleRateLimit() {
  const currentTime = Date.now();
  const timePassed = currentTime - requestStartTime;
  const timeLeft = 60000 - timePassed; // milliseconds remaining in the current minute
  
  if (requestCount >= RPM_LIMIT) {
    console.log("Rate limit reached. Sleeping for", (timeLeft / 1000).toFixed(2), "seconds...");
    await sleep(timeLeft);
    requestCount = 0;
    requestStartTime = Date.now();
  } else {
    requestCount++;
  }
}

module.exports = { processEmailWithGemini };
