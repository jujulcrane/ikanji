const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

// Initialize Firebase Admin
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

const db = admin.firestore();

async function uploadLesson() {
  try {
    const userId = 'V7ZOSGug90XpRG09dFPJX9nNZex2';

    // Read the lesson JSON
    const lessonPath = path.join(__dirname, '..', 'quartet_lesson3.json');
    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));

    console.log('Uploading lesson to Firestore...');
    console.log('Lesson name:', lessonData.name);
    console.log('Number of practice sentences:', lessonData.practiceSentences.length);

    // Add the lesson to Firestore
    const lessonRef = await db.collection('lessons').add({
      ...lessonData,
      userId: userId,
      createdAt: new Date().toISOString(),
    });

    console.log('Lesson created with ID:', lessonRef.id);

    // Update the user's lessonIds array
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      lessonIds: admin.firestore.FieldValue.arrayUnion(lessonRef.id),
    });

    console.log('User lessonIds updated successfully');
    console.log('\nLesson uploaded successfully!');
    console.log('Lesson ID:', lessonRef.id);

  } catch (error) {
    console.error('Error uploading lesson:', error);
    process.exit(1);
  }
}

uploadLesson();
