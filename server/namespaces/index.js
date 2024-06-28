const admin = require('./admin');
const audiocall = require('./audiocall');
const videocall = require('./videocall');
const chat = require('./chat');
const notification = require('./notification');
const multiChat = require('./multipleChats')


module.exports = (io) => {

    admin(io);
    audiocall(io);
    videocall(io);
    chat(io);
    notification(io);
    multiChat(io);
}