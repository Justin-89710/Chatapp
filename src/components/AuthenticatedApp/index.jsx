//imports
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from '../Landing/index.jsx';
import ChatRoom from '../ChatRoom';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

//main function
function AuthenticatedApp() {
    //vairables for main function
    const { user } = useAuth();
    const [setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    //useEffect function
    useEffect(() => {
        //async function
        const fetchUsers = async () => {
            try {
                //fetching data from api
                const response = await fetch('http://localhost:5000/api/users');
                const data = await response.json();
                setUsers(data);
                setLoading(false);
                //error handling
            } catch (error) {
                console.error('Error fetching users: ', error);
                setLoading(false);
            }
        }; //end of async function

        //if user is true then fetch users
        if (user) {
            fetchUsers();
        } else { //else set loading to false
            setLoading(false);
        } //end of if else
    }, [user, setUsers]); //end of useEffect

    //if loading is true then return loading message
    const usersFromFirebase = useUsers();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    //returning the main function
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing users={usersFromFirebase} />} />
                <Route path="/room/:id" element={<ChatRoom />} />
            </Routes>
        </BrowserRouter>
    );
} //end of main function

//exporting the main function
export { AuthenticatedApp };