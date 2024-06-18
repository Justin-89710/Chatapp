// imports
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

//main function
function useMessages(roomId) {
    //variables for main function
    const [messages, setMessages] = useState([]);

    //useEffect function
    useEffect(() => {
        //variables for useEffect function
        const messagesRef = collection(db, 'chat-rooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        //onSnapshot function
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [roomId]);

    return messages;
}

//exporting the main function
export { useMessages };
