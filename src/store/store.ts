import { configureStore } from "@reduxjs/toolkit";
import userinfo from "./userinfo/userinfo";

const store = configureStore({
    reducer: {userinfo}
})

export default store;
