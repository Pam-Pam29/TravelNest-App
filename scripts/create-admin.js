const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, 'service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

const email = 'admin@travenest.com';
const password = '129949Victoria@'; // Use a strong password!
const displayName = 'Admin User';

async function createAdminUser() {
  try {
    // Create user in Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });
    
    // Store user data in Firestore with admin role
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: displayName,
      email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Admin user created with UID: ${userRecord.uid}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser().then(() => process.exit());
