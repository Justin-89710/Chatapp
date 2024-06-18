//Imports
import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import styles from './styles.module.scss';

//Main function
const UnauthenticatedApp = () => {
    //variables for main function
    const { loginWithGoogle } = useContext(AuthContext);

    //handleLoginWithGoogle function
    const handleLoginWithGoogle = async () => {
        console.log('Attempting to login with Google...');
        try {
            const user = await loginWithGoogle();
            if (user) {
                console.log('Login successful');
                console.log('User:', user);
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };

    //returning the main function
    return (
        <div className={styles.container}>
            <div className={styles.blur}>
            <img src="https://cdn-icons-png.flaticon.com/512/9639/9639625.png" alt="React logo" className={styles.logo} />
            <h1 className={styles.title}>Login or Register!</h1>
            <button className={styles.loginButton} onClick={handleLoginWithGoogle}>Login with Google</button>
            </div>
        </div>
    );
};

//Exporting the main function
export { UnauthenticatedApp };
