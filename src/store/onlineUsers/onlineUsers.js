import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    onlineUsers: [],
    // onlineUsersCount: 0,
    // onlineUsersLoaded: false,
    // onlineUsersError: null
};


const onlineUsersSlice = createSlice({
    name: "userinfo",
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        // setOnlineUsersCount: (state, action) => {
        //     state.onlineUsersCount = action.payload;
        // },
        // setOnlineUsersLoaded: (state, action) => {
        //     state.onlineUsersLoaded = action.payload;
        // },
        // setOnlineUsersError: (state, action) => {
        //     state.onlineUsersError = action.payload;
        // }
    }
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;