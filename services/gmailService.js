// services/gmailService.js
const { google } = require('googleapis');

async function getEmails(accessToken, maxResults = 10) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      q: 'is:unread',
      maxResults,
    });
    return res.data.messages || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
}

async function getEmailContent(accessToken, messageId) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching email content:", error);
    throw error;
  }
}

module.exports = { getEmails, getEmailContent };
