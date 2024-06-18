//imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, createGroup } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import styles from './styles.module.scss';

//main function
function Landing({ users }) {
    //variables for main function
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [newMessages, setNewMessages] = useState({});
    const { user, loading } = useAuth();

    //useEffect function
    useEffect(() => {
        //if user is true then fetch groups
        if (user) {
            const groupsCollectionRef = collection(db, 'groups');
            const unsubscribe = onSnapshot(groupsCollectionRef, (snapshot) => {
                const fetchedGroups = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                //filter groups by user id
                const filteredGroups = fetchedGroups.filter(group => group.members.includes(user.uid));
                setGroups(filteredGroups);

                //check for new messages
                checkForNewMessages(filteredGroups);
            }); //end of unsubscribe

            //return unsubscribe
            return () => unsubscribe();
        } //end of if
    }); //end of useEffect

    //checkForNewMessages function
    const checkForNewMessages = async (groups) => {
        //newMessagesStatus object
        const newMessagesStatus = {};
        //for loop
        for (const group of groups) {
            //fetch latest message
            const latestMessage = await fetchLatestMessage(group.id);
            const lastClickTimestamp = localStorage.getItem(`lastClick_${group.id}`) || 0;
    
            // Check if there's a latest message and it's not sent by the current user
            if (latestMessage && latestMessage.senderId !== user.uid) {
                newMessagesStatus[group.id] = latestMessage.timestamp > lastClickTimestamp;
            } else { //else set new messages to false
                newMessagesStatus[group.id] = false;
            }
        } //end of for loop
        setNewMessages(newMessagesStatus);
    }; //end of checkForNewMessages
    
    //fetchLatestMessage function
    const fetchLatestMessage = async (roomId) => {
        try {
            //fetching data from db
            const messagesCollectionRef = collection(db, `chat-rooms/${roomId}/messages`);
            const q = query(messagesCollectionRef, orderBy('timestamp', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);

            //if querySnapshot is not empty then return latest message
            if (!querySnapshot.empty) {
                const latestMessage = querySnapshot.docs[0].data();
                //return latest message
                return {
                    senderId: latestMessage.uid,
                    timestamp: latestMessage.timestamp.toMillis()
                };
            } else { //else return null
                return null;
            }
        } catch (error) { //error handling
            console.error('Error fetching latest message:', error);
            return null;
        }
    }; //end of fetchLatestMessage

    //handleGroupClick function
    const handleGroupClick = async (groupId) => {
        //set last click timestamp
        localStorage.setItem(`lastClick_${groupId}`, Date.now().toString());
        setNewMessages({
            ...newMessages,
            [groupId]: false
        });
    }; //end of handleGroupClick

    //handleMemberSelect function
    const handleMemberSelect = (userId) => {
        const isSelected = selectedMembers.includes(userId);
        //if user is selected then remove user from selected members
        if (isSelected) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    }; //end of handleMemberSelect

    //handleCreateGroup function
    const handleCreateGroup = async () => {
        try {
            //error handling
            if (!groupName) {
                alert('Please enter a group name.');
                return;
            } else if (selectedMembers.length === 0) {
                alert('Please select at least one member.');
                return;
            } else if (selectedMembers.length === 1) {
                alert('Please select at least one more member.');
                return;
                //if selected members include user id then alert
            } else if (selectedMembers.includes(user.uid)) {
                await createGroup(groupName, selectedMembers);
                alert('Group created successfully!');
                setGroupName('');
                setSelectedMembers([]);
            } else { //else alert
                alert('You must be part of the group.');
            }
            //error handling
        } catch (error) {
            console.error('Error creating group:', error.message);
            alert('Failed to create group. Please try again.');
        }
    };

    //returning the main function   
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Please log in to view this page.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.groupContainer}>
                    <h2 className={styles.title}>Your Groups</h2>
                    <ul className={styles.groupList}>
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <Link
                                    to={`/room/${group.id}`}
                                    key={group.id}
                                    onClick={() => handleGroupClick(group.id)}
                                    className={styles.groupLink}
                                >
                                    <li className={styles.groupItem}>
                                        <div className={styles.groupName}>
                                            {group.name}
                                            {newMessages[group.id] && (
                                                <div className={styles.newMessageIndicatorContainer}>
                                                    <div className={styles.newMessageIndicator}>!</div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                </Link>
                            ))
                        ) : (
                            <li>No groups found.</li>
                        )}
                    </ul>
                </div>
            </div>
            <div className={styles.mainContent}>
                <form>
                    <h2 className={styles.title}>Create a Custom Group</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="groupName" className={styles.inputLabel}>Group Name:</label>
                        <h5 className={styles.subtext}>must have a name!</h5>
                        <input
                            type="text"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className={styles.inputText}
                            required
                        />
                    </div>
                    <h3 className={styles.title}>Select Members:</h3>
                    <h5 className={styles.subtext}>Click on the name to select</h5>
                    <ul className={styles.membersList}>
                        {users.map((user) => (
                            <li key={user.uid} className={styles.memberItem}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        id={`user-${user.uid}`}
                                        checked={selectedMembers.includes(user.uid)}
                                        onChange={() => handleMemberSelect(user.uid)}
                                    />
                                    {user.displayName || user.email}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button type="button" onClick={handleCreateGroup} className={styles.button}>Create Group</button>
                </form>
            </div>
        </div>
    );
}

//exporting the main function
export { Landing };
