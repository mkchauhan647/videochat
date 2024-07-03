import { configureStore } from "@reduxjs/toolkit";
import userinfo from "./userinfo/userinfo";
import socketListener from "./socketListener/socketListener";

const store = configureStore({
    reducer: {
        userinfo,
        socketListener
    }
})

export default store;
