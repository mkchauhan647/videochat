
function chat(io) {

    const chat = io.of('/chat');

    chat.on("connection", (socket) => {
        
        console.log("A new Chat client has been connected !!")
       
    })
    
}


module.exports = chat;