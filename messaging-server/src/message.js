

function fetchChatroomsDb(data) {

    const { currentUser } = data;

}

function fetchMessagesDb(data) {

    const { currentUser, otherUser } = data;

}

function saveMessageDb(data) {

    const { message, sender, receiver, date } = data;


}

module.exports = { fetchChatroomsDb, fetchMessagesDb, saveMessageDb };