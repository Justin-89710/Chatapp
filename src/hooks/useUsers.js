// imports
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

//main function
const useUsers = () => {
    const [users, setUsers] = useState([]);

    //useEffect function
    useEffect(() => {
        //async function
        const fetchUsers = async () => {
            try {
                //fetching data the users collection
                const usersCollectionRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersList = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
                setUsers(usersList); //set users to usersList
            } catch (error) { //error handling
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return users;
};

//exporting the main function
export { useUsers };
