const axios = require('axios');
const sleep = require('util').promisify(setTimeout);

// Rate limiting: 3 requests per minute for free-tier usage.
const RPM_LIMIT = 3;
let requestCount = 0;
let requestStartTime = Date.now();

// Gemini endpoint and model details based on the curl sample.
// (Adjust the endpoint/model if Google updates their API.)
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function processEmailWithGemini(emailData) {
  // Build the prompt using email details
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

Return the result as JSON in this format:
{
  "eventName": "Event Name",
  "eventDate": "Event Date",
  "deadline": "Deadline",
  "details": "Additional Details"
}
  `;
  
  console.log("Sending prompt to Gemini:", prompt);
  await handleRateLimit();
  
  try {
    // Build the URL with your Gemini API key as a query parameter
    const url = `${GEMINI_BASE_URL}?key=${process.env.GEMINI_API_KEY}`;
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Assume Gemini returns an array of candidates under response.data.candidates.
    // Adjust the extraction based on the actual API response.
    const rawOutput = response.data.candidates[0].output.trim();
    console.log("Raw Gemini output:", rawOutput);
    
    let structuredData;
    try {
      structuredData = JSON.parse(rawOutput);
    } catch (jsonError) {
      console.error("JSON parse error in Gemini output. Raw output:", rawOutput);
      // Return empty object so caller can skip this email.
      return {};
    }
    
    return structuredData;
  } catch (error) {
    console.error("Error processing email with Gemini:", error.response?.data || error.message);
    throw error;
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
