//imports
import React, { createContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

//create context
const AuthContext = createContext();

//main function
const AuthProvider = ({ children }) => {
    //variables for main function
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //useEffect function
    useEffect(() => {
        //unsubscribe function
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                saveUserInfoToDatabase(user); // Save user info to database on login
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    //saveUserInfoToDatabase function
    const saveUserInfoToDatabase = async (user) => {
        try {
            const userRef = doc(db, 'users', user.uid); // Using `doc` to get a reference to the document
            const userData = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            };
            await setDoc(userRef, userData, { merge: true }); // Use `setDoc` to set document data
        } catch (error) {
            console.error('Error saving user info to database:', error);
        }
    };
    

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            // User info is automatically updated in onAuthStateChanged callback
            return user;
        } catch (error) {
            console.error('Error logging in with Google:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//exporting the main function
export { AuthProvider, AuthContext };
