const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.trim().startsWith('#') || !line.trim()) return;

  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let value = match[2].trim();
    // Remove surrounding quotes if present and unescape \n
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Replace literal \n with actual newlines
    value = value.replace(/\\n/g, '\n');
    envVars[match[1]] = value;
  }
});

// Initialize Firebase Admin just for creating custom token
if (!admin.apps.length) {
  const privateKey = envVars.FIREBASE_PRIVATE_KEY;

  if (!privateKey || !envVars.FIREBASE_PROJECT_ID || !envVars.FIREBASE_CLIENT_EMAIL) {
    console.error('Missing Firebase credentials in .env file');
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: envVars.FIREBASE_PROJECT_ID,
      clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

async function uploadLesson() {
  try {
    const userId = 'V7ZOSGug90XpRG09dFPJX9nNZex2';

    // Read the lesson JSON
    const lessonPath = path.join(__dirname, '..', 'quartet_lesson3.json');
    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));

    console.log('Creating custom token for user:', userId);

    // Create a custom token for the user
    const customToken = await admin.auth().createCustomToken(userId);

    console.log('Custom token created successfully');
    console.log('\nNow you can use this token to sign in and upload the lesson.');
    console.log('Token:', customToken);

    // Instructions for manual upload
    console.log('\n=== Instructions ===');
    console.log('1. The lesson data is saved in quartet_lesson3.json');
    console.log('2. Use the custom token above to authenticate in your app');
    console.log('3. Then make an API call to /api/create-lesson with the lesson data');
    console.log('\nAlternatively, you can import this lesson through the web UI.');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadLesson();
