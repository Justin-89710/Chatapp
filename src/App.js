//imports
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/auth';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';

//main function
function App() {
    //variables for main function
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Loading...</p>;
    }

    //returning the main function
    return (
        //if user is true then return AuthenticatedApp else return UnauthenticatedApp
        <AuthProvider>
            {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </AuthProvider>
    );
}

//exporting the main function
export default App;
