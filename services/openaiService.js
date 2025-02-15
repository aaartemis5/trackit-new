// services/openaiservice.js
const axios = require('axios');
const sleep = require('util').promisify(setTimeout);

const RPM_LIMIT = 3;  
let requestCount = 0;
let requestStartTime = Date.now();

async function processEmailWithOpenAI(emailData) {
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
  
  console.log("Sending prompt to OpenAI:", prompt);
  await handleRateLimit();
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18', // Use gpt-3.5-turbo by default
        messages: [
          {
            role: "system",
            content: "You are an assistant that extracts structured event details from emails. Return the output strictly in JSON format."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawOutput = response.data.choices[0].message.content.trim();
    console.log("Raw OpenAI output:", rawOutput);

    let structuredData;
    try {
      structuredData = JSON.parse(rawOutput);
    } catch (jsonError) {
      console.error("JSON parse error in OpenAI output. Raw output:", rawOutput);
      return {};
    }
    
    return structuredData;
  } catch (error) {
    console.error("Error processing email with OpenAI:", error.response?.data || error.message);
    throw error;
  }
}

async function handleRateLimit() {
  const currentTime = Date.now();
  const timePassed = currentTime - requestStartTime;
  const timeLeft = 60000 - timePassed;
  
  if (requestCount >= RPM_LIMIT) {
    console.log("Rate limit reached. Sleeping for", (timeLeft / 1000).toFixed(2), "seconds...");
    await sleep(timeLeft);
    requestCount = 0;
    requestStartTime = Date.now();
  } else {
    requestCount++;
  }
}

module.exports = { processEmailWithOpenAI };
