const admin = require('firebase-admin');

// IMPORTANT: For security and portability, it is highly recommended to
// replace this hardcoded path. A better approach is to place the key file
// in your project, add it to .gitignore, and load it with a relative path
// like: require('./serviceAccountKey.json');
const serviceAccount = require('C:\\Users\\shash\\Downloads\\imlegalguardian-firebase-adminsdk-fbsvc-056a0b1fee.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid: string = 'test-user-123';

admin.auth().createCustomToken(uid)
  .then((customToken: string) => {
    console.log('Generated custom token:', customToken);
    console.log('Copy this token and paste it into your .env.local file.');
    console.log('Remember to restart your dev server after updating the file!');
  })
  .catch((error: Error) => {
    console.error('Error creating custom token:', error);
  });