
function notification(io) {
    const notification = io.of('/notification');

    notification.on('connection', (socket) => {
       
        console.log("A new notification socket is just connected !")
    });
}

module.exports = notification;