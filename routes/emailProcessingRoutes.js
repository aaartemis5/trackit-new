const express = require('express');
const { getEmails, getEmailContent } = require('../services/gmailService');
const { processEmailWithGemini } = require('../services/geminiaiService'); // Updated import for Gemini
const ResponseModel = require('../models/response');


const router = express.Router();

/**
 * POST /api/email/process-emails
 * Expects: { token: "<Gmail access token>" }
 * Fetches up to 20 unread emails, processes each via Gemini,
 * and stores structured event data (if applicable) in MongoDB.
 */
router.post('/process-emails', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Access token required" });
  }

  try {
    // Fetch a limited number of unread emails (e.g., 20)
    const messages = await getEmails(token, 3);
    console.log(`Fetched ${messages.length} emails`);

    if (messages.length === 0) {
      return res.status(200).json({ message: "No emails found." });
    }

    let processedEmails = [];

    for (let message of messages) {
      try {
        const emailContent = await getEmailContent(token, message.id);
        console.log(`Processing email ID: ${message.id}`);

        let subject = "";
        let from = "";
        let date = "";
        if (emailContent.payload && emailContent.payload.headers) {
          const headers = emailContent.payload.headers;
          subject = headers.find(h => h.name === 'Subject')?.value || "";
          from = headers.find(h => h.name === 'From')?.value || "";
          date = headers.find(h => h.name === 'Date')?.value || "";
        }
        
        // Package email details for Gemini processing.
        const emailData = {
          subject,
          from,
          date,
          snippet: emailContent.snippet || ""
        };

        console.log("Email Data being sent to Gemini:", emailData);

        // Process email data with Gemini.
        const structuredData = await processEmailWithGemini(emailData);
        console.log("Structured data from Gemini:", structuredData);

        // Skip if the email is not event-related (missing eventName and deadline)
        if (!structuredData || (!structuredData.eventName && !structuredData.deadline)) {
          console.log("Skipping non-event email or email with processing failure:", subject);
          continue;
        }

        const responseRecord = new ResponseModel({
          eventName: structuredData.eventName,
          eventDate: structuredData.eventDate,
          deadline: structuredData.deadline,
          details: structuredData.details,
          emailAddress: from,
        });
        await responseRecord.save();
        processedEmails.push(responseRecord);
      } catch (innerError) {
        console.error("Error processing a single email:", innerError.message);
        // Continue processing remaining emails even if one fails.
        continue;
      }
    }

    res.status(200).json({
      message: "Emails processed successfully",
      data: processedEmails
    });
  } catch (error) {
    console.error("Error processing emails:", error);
    res.status(500).json({ message: "Error processing emails", error: error.message });
  }
});

module.exports = router;
