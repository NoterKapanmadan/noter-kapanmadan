import { query } from './db.js';
import { v4 as uuidv4 } from 'uuid';

export async function fetchChatroomsDb(data) {
    const { currentUser } = data;

    try {
        const result = await query(
            `SELECT c.chatroom_ID, 
                    c.account1_ID, 
                    c.account2_ID, 
                    m.text AS newest_message, 
                    m.date AS newest_message_date
             FROM ChatRoom c
             LEFT JOIN (
                 SELECT chatroom_ID, text, date
                 FROM Message
                 WHERE date = (SELECT MAX(date) FROM Message WHERE chatroom_ID = Message.chatroom_ID)
             ) m ON c.chatroom_ID = m.chatroom_ID
             WHERE c.account1_ID = $1 OR c.account2_ID = $1
             ORDER BY m.date DESC`,
            [currentUser]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching chatrooms:', error);
        throw error;
    }
}

export async function fetchMessagesDb(data) {
    const { currentUser, otherUser } = data;

    try {
        const result = await query(
            `SELECT *
             FROM Message
             WHERE (sender_ID = $1 AND chatroom_ID IN (
                       SELECT chatroom_ID FROM ChatRoom 
                       WHERE (account1_ID = $1 AND account2_ID = $2) OR (account1_ID = $2 AND account2_ID = $1)))
                OR (sender_ID = $2 AND chatroom_ID IN (
                       SELECT chatroom_ID FROM ChatRoom 
                       WHERE (account1_ID = $1 AND account2_ID = $2) OR (account1_ID = $2 AND account2_ID = $1)))
             ORDER BY date DESC`,
            [currentUser, otherUser]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

export async function saveMessageDb(data) {
    const { message, sender, receiver, date } = data;

    // Generate a new UUID for the message and chatroom if needed
    const messageId = uuidv4();
    const chatroomId = uuidv4();

    try {
        await query('BEGIN'); // Start the transaction

        // Check if a chatroom already exists between sender and receiver
        const chatroomResult = await query(
            `SELECT chatroom_ID FROM ChatRoom 
             WHERE (account1_ID = $1 AND account2_ID = $2) 
                OR (account1_ID = $2 AND account2_ID = $1)`,
            [sender, receiver]
        );

        let existingChatroomId;

        if (chatroomResult.rows.length === 0) {
            // Create a new chatroom if none exists
            await query(
                `INSERT INTO ChatRoom (chatroom_ID, account1_ID, account2_ID) 
                 VALUES ($1, $2, $3)`,
                [chatroomId, sender, receiver]
            );
            existingChatroomId = chatroomId;
        } else {
            // Use the existing chatroom ID
            existingChatroomId = chatroomResult.rows[0].chatroom_ID;
        }

        // Insert the message into the Message table
        await query(
            `INSERT INTO Message (chatroom_ID, message_ID, sender_ID, text, date) 
             VALUES ($1, $2, $3, $4, $5)`,
            [existingChatroomId, messageId, sender, message, date]
        );

        await query('COMMIT'); // Commit the transaction

        return { success: true };
    } catch (error) {
        await query('ROLLBACK'); // Rollback the transaction in case of error
        console.error('Error saving message:', error);
        throw error;
    }
}

