//imports
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sendMessage } from '../../services/firebase';
import styles from './styles.module.scss';

//main function
function MessageInput({ roomId }) {
    //variables for main function
    const { user } = useAuth();
    const [value, setValue] = useState('');

    //handleChange function
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    //handleSubmit function
    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(roomId, user, value);
        setValue('');
    };

    //returning the main function
    return (
        <form onSubmit={handleSubmit} className={styles['message-input-container']}>
            <input
                type="text"
                placeholder="Enter a message"
                value={value}
                onChange={handleChange}
                className={styles['message-input']}
                required
                minLength={1}
            />
            <button type="submit" disabled={value.length < 1} className={styles['send-message']}>
                Send
            </button>
        </form>
    );
}

//exporting the main function
export { MessageInput };
