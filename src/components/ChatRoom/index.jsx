//imports
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { MessageInput } from '../MessageInput/index';
import { MessageList } from '../MessageList/index';
import styles from './ChatRoom.module.scss';

//main function
function ChatRoom() {
    //variables for main function
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    //useEffect function
    useEffect(() => {
        //fetchRoom function
        const fetchRoom = async () => {
            try {
                //Get room info from db
                const roomRef = doc(db, 'chat-rooms', id);
                const roomSnap = await getDoc(roomRef);
                //if room exists then set room data
                if (roomSnap.exists()) {
                    const roomData = roomSnap.data();
                    setRoom({ id: roomSnap.id, name: roomData.name, ...roomData });
                    //else create a new room
                } else {
                    console.log('Room not found, creating...');
                    await createRoom(id);
                    const newRoomSnap = await getDoc(roomRef);
                    const newRoomData = newRoomSnap.data();
                    setRoom({ id: newRoomSnap.id, name: newRoomData.name, ...newRoomData });
                }
                //error handling
            } catch (error) {
                console.error('Error fetching room:', error);
            }
        };

        fetchRoom();
    }, [id]); //end of useEffect

    //createRoom function
    const createRoom = async (id) => {
        const roomRef = doc(db, 'chat-rooms', id);
        await setDoc(roomRef, { name: `Room ${id}`, latestMessageTimestamp: serverTimestamp() });
    };

    if (!room) {
        return <h2>Loading...</h2>;
    }

    //returning the main function
    return (
        <div className={styles.container}>
        <div className={styles.chatRoom}>
            <h2 className={styles.roomTitle}>{room.name}</h2>
            <div>
                <Link to="/" className={styles.backLink}>⬅️ Back to all rooms</Link>
            </div>
            <div className={styles.messagesContainer}>
                <MessageList roomId={room.id} />
                <MessageInput roomId={room.id} />
            </div>
        </div>
        </div>
    );
}

//exporting the main function
export default ChatRoom;