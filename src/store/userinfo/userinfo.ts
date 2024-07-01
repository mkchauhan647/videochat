import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithPop } from "@/firebaseConfig"
import { useEffect } from "react";
import { auth } from "@/firebaseConfig/firebaseConfig";


const initialState = {
  username: "",
  email: "",
//   password: "",
  isLogged: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("user ff", action.payload);
            state.username = action.payload.displayName;

            state.email = action.payload.email;
            // state.password = action.payload.password;
            state.isLogged = true;
        });
        // builder.addCase(logout.fulfilled, (state) => {
        //     state.username = "";
        //     state.email = "";
        //     state.password = "";
        //     state.isLogged = false;
        // });
    }
});


export const login = createAsyncThunk("user/login", async () => {

    console.log("login");

    if (auth.currentUser) {
        console.log('logcurrent', auth.currentUser.displayName)
        const user = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            // password: auth.currentUser.password,
        
        }
        return user;
    }
        

    const user:any = await signInWithPop();
    const userObj = {
        displayName: user.displayName,
        email: user.email,
    }
    return userObj;
});


// export const {  } = userSlice.actions;
export default userSlice.reducer;