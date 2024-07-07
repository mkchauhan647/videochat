const LocalSocketIdToUserId = {};
const LocalUserIdToSocketId = {};


function videoCall(io, { socketIdToUserId, userIdToSocketId }) {
    

    const call = io.of('/videocall');

    call.on('connection', (socket) => {
        console.log("video call namespace connected");
        console.log("uid", socket.handshake.query.uid);
        console.log("socket id", socket.id);
        LocalSocketIdToUserId[socket.id] = socket.handshake.query.uid;
        LocalUserIdToSocketId[socket.handshake.query.uid] = socket.id;

        socket.on('video-call', (data) => {
            // console.log("video call event", data);
            // socketIdToUserId[socket.id] = data.uid;
            // userIdToSocketId[data.username] = socket.id;
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('video-call', data);
        
        })

        socket.on('candidate', (data) => {
            console.log("candidate", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('candidate', data);
            // call.emit('candidate', data);
        
        })

        socket.on('call-accepted', (data) => {
            // console.log("call accepted", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('call-accepted', data);
        
        })

        socket.on('disconnect', () => {
            console.log("video call namespace disconnected");
        })

        socket.on('chat-connection', (data) => {
            // console.log("chat connection event", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('chat-connection', data);
        })

        socket.on('chat-accepted', (data) => {
            // console.log("chat accepted event", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('chat-accepted', data);
        });

        socket.on('chat-rejected', (data) => {
            // console.log("chat rejected event", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('chat-rejected', data);
        });

        socket.on('message', (data) => {
            // console.log("message event", data);
            const toCall = LocalUserIdToSocketId[data.to.uid];
            socket.to(toCall).emit('message', data);
        });

        // socket.on('send')
    })





}


module.exports = videoCall;