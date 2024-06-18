// Code to fetch all users from Firebase Auth
const admin = require('firebase-admin');
const serviceAccount = require('./chatappnew-98d0b-firebase-adminsdk-mpq0e-b3a56fbefb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Function to fetch all users
async function getAllUsers() {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(userRecord => ({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
        }));
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

module.exports = { getAllUsers };
