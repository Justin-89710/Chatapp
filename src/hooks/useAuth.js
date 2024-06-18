//imports
import { useContext } from 'react';
import { AuthContext } from '../context/auth.js';

//main function
function useAuth() {
    const { user, loading } = useContext(AuthContext);
    return { user, loading };
}

//exporting the main function
export { useAuth };
