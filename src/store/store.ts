import { configureStore } from "@reduxjs/toolkit";
import userinfo from "./userinfo/userinfo";
import socketListener from "./socketListener/socketListener";
import peerConnection from "@/components/videochat/peerConnection";
import onlineUsers from './onlineUsers/onlineUsers'

const store = configureStore({
    reducer: {
        userinfo,
        socketListener,
        peerConnection,
        onlineUsers
    }
})

export default store;
