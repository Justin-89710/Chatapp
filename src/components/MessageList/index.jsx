// Imports
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import styles from './styles.module.scss';

// Main function
function MessageList({ roomId }) {
    // Variables for main function
    const containerRef = useRef(null);
    const { user } = useAuth();
    const messages = useMessages(roomId);

    // useEffect function
    useEffect(() => {
        // Scroll to the bottom of the container when messages change
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    // Return the main function
    return (
        <div className={styles['message-list-container']} ref={containerRef}>
            <ul className={styles['message-list']}>
                {messages.map((message) => (
                    <Message key={message.id} message={message} user={user} />
                ))}
            </ul>
        </div>
    );
}

// Export the main function
function Message({ message, user }) {
    const isUserMessage = message.uid === user.uid;
    return (
        <li className={`${styles.message} ${isUserMessage ? styles['user-message'] : ''}`}>
            <span className={styles['message-sender']}>{message.displayName || message.email}:</span>
            <br />
            <span className={styles['messageText']}>{message.text}</span>
        </li>
    );
}

// Export the main function
export { MessageList };
