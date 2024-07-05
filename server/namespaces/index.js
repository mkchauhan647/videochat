const admin = require('./admin');
const audiocall = require('./audiocall');
const videocall = require('./videocall');
const chat = require('./chat');
const notification = require('./notification');
const multiChat = require('./multipleChats')


module.exports = (io,{socketIdToUserId,userIdToSocketId}) => {

    admin(io);
    audiocall(io);
    videocall(io,{socketIdToUserId,userIdToSocketId});
    chat(io);
    notification(io);
    multiChat(io);
}