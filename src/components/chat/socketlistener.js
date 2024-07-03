
const createSocketListener = () => {
    const socket = io('http://localhost:3001/chat');

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('message', (message) => {
        console.log('message', message);
    });
  

}