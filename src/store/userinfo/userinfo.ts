import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { auth} from "@/firebaseConfig/firebaseConfig"
import axios from "axios";
import { signInWithPop, addData,getData, logOut,signInWithEmail, signUpWithEmail } from '@/firebaseConfig';
import { useRouter } from 'next/router';
import { redirect } from "next/navigation";
const initialState =  {
    username: "",
    email: "",
    photoUrl: "",
    isLogged: false,
};
console.log("initialState", initialState);
// {
//   username: window.localStorage.getItem("username") || "",
//   email: "",
//     //   password: "",
//     photoUrl: "",
//   isLogged: false,
// };

const userSlice = createSlice({
  name: "user",
  initialState,
    reducers: {
        logout: (state) => {
            state.username = "";
            state.email = "";
            state.photoUrl = "";
            state.isLogged = false;
            logOut();
            // router.push("/");
            redirect("/");
        },
    
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("user ff", action.payload);
            state.username = action.payload.displayName;

            state.email = action.payload.email;
            state.photoUrl = action.payload.photoUrl;
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


export const login = createAsyncThunk("user/login", async(action:any) => {

    console.log("login");
    console.log("auth", action);
    // console.log("auth", okay);

    if (auth.currentUser) {
        console.log('logcurrent', auth.currentUser.displayName)
        const user = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoUrl : auth.currentUser.photoURL,
            // password: auth.currentUser.password,
        
        }
        // await addData({...user,uid:auth.currentUser.uid,isOnline:true})
        return user;
    }
        

    // 
    let user;
    if (action.provider === "email" && action.type === "Sign Up") {
        // user = await signInWithPop();
        user = await signUpWithEmail(action.email, action.password);
        console.log("user", user); 
        user.displayName = 'No name';
    }
   else if (action.provider == 'email' && action.type == 'Sign In')  {
        user = await signInWithEmail(action.email, action.password);
    }
    else {
        user = await signInWithPop();
    }

    // const user:any = await fetch("http://localhost:3001/auth/signin-with-popup")
    
    const userObj = {
        displayName: user.displayName,
        email: user.email,
    }
    return userObj;
});


export const { logout } = userSlice.actions;
export default userSlice.reducer;