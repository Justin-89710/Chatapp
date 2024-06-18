//imports
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

//firebase configuration
const firebaseConfig = {

};

//initialize firebase app
const app = initializeApp(firebaseConfig);
//initialize firestore and auth
const db = getFirestore(app);
const auth = getAuth(app);

//exporting the functions
async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
            });
        }

        return { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL };
    } catch (error) {
        console.error('Error logging in with Google:', error);
        return null;
    }
}

async function sendMessage(roomId, user, text) {
    try {
        const { uid, displayName, photoURL } = user;
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid,
            displayName,
            photoURL,
            text,
            timestamp: serverTimestamp(),
        });

        const roomRef = doc(db, 'groups', roomId);
        await setDoc(roomRef, {
            latestMessageTimestamp: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function getMessages(roomId, callback) {
    return onSnapshot(
        query(collection(db, 'chat-rooms', roomId, 'messages'), orderBy('timestamp', 'asc')),
        (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        }
    );
}

async function createGroup(groupName, selectedMembers) {
    try {
        const newGroupRef = await addDoc(collection(db, 'groups'), {
            name: groupName,
            members: selectedMembers,
        });
        console.log('Group created with ID:', newGroupRef.id);
    } catch (error) {
        console.error('Error creating group:', error);
    }
}

export { auth, db, loginWithGoogle, sendMessage, getMessages, createGroup, signOut, signInWithPopup };
