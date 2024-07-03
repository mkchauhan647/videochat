
let socketidToUsername = {};
let usernameToSocketid = {};


function chat(io) {

    const chat = io.of('/chat');

    chat.on("connection", (socket) => {

        
        console.log("A new Chat client has been connected !!",socket.id)


        socket.on("join", ({ username, room }) => {
            console.log("User joined the room", username, room);

            socket.broadcast.to('room1').emit("message", `${username} has joined the chat`);
        });

        socket.on("message", ({ room, message }) => {
            console.log("Message received", message);
            // socket.broadcast.to('room1').emit("message", message);
            socket.broadcast.emit("message", message);
        });
       
        socket.on('disconnect', () => {
            console.log("A user has been disconnected !!", socket.id)
            // socketids = socketids.filter((id) => id !== socket.id);
        })
    })
    
}


module.exports = chat;