import { google } from 'googleapis';
import open from 'open';
import readline from 'readline';
import 'dotenv/config'; // to load your .env automatically

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing CLIENT_ID or CLIENT_SECRET in environment variables.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Generate the auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/gmail.send']
});

console.log('\n1️⃣  Visit this URL in your browser:\n\n', authUrl, '\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const code = await new Promise(resolve =>
  rl.question('2️⃣  Paste the "code" from the browser URL here: ', resolve)
);
rl.close();

try {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('\n✅ Your refresh token:\n', tokens.refresh_token);
  console.log('\n💾 Save this securely as GOOGLE_REFRESH_TOKEN in your environment variables.');
} catch (err) {
  console.error('❌ Failed to exchange code for tokens:', err);
}

