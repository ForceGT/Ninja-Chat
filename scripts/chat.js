//adding chats to the chatroom

class Chatroom{
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }


async addChat(message){
    //format to a chat object
    const now = new Date();
    console.log(now);
    const chat = {
        message,
        username : this.username,
        room : this.room,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    //save the chat document
    const response = await this.chats.add(chat);
    return response;
}

getChats(callback){
    this.unsub=this.chats
    .where('room', '==', this.room)
    .orderBy('created_at')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if(change.type === 'added' ){
                //update ui
                callback(change.doc.data());
            }
        });
    });
}
updateName(username){
    this.username = username;
    localStorage.setItem('username', username);
}

updateRoom(room){
    this.room = room;
    if(this.unsub()){
        this.unsub();
    }
    
}
}

