const multipleChats = (io) => {


    const chat = io.of('/multiChat');


    chat.on("connection", (socket) => {
        socket.join(0);
        console.log('A new user is joined in multichat')
        socket.on('joinRoom', (room) => {
            console.log("This is data",room)
            socket.join(room);
            
            console.log("A new user is joined in room ", room);
            socket.to(room).emit('roomJoined', room);
        })

        socket.on('sendMessage', (data) => {
            console.log("Here is your message", data.message);
            
            // if (data.roomId == 0) {
            //     socket.join(data.roomId)
            // }

            console.log("id",data.roomId)

                    chat.to(data.roomId).emit('rcv',JSON.stringify(data))
                    
                })

        // socket.on('')
    })
}

module.exports = multipleChats;