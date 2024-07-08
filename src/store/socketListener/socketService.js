import io from 'socket.io-client';
import { useSelector,useDispatch } from 'react-redux';
let socket;

export const initializeSocket = () => {
    const userinfo = useSelector((state) => state.userinfo);
    // socket = io(`https://witty-suave-dormouse.glitch.me/${namespace}`, {  
    socket = io(`https://192.168.1.65:3001/${namespace}`, {

        rejectUnauthorized: false,
        query: {
            uid: userinfo.uid
        }
    });
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        // throw new Error('Socket not initialized');
      socket =   initializeSocket();
    }
    return socket;
};
