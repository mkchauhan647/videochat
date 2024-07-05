import { Dispatch, GetState, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { use, useEffect } from "react";
import { auth} from "@/firebaseConfig/firebaseConfig"
import axios from "axios";
import { signInWithPop, addData,getData, logOut,signInWithEmail, signUpWithEmail } from '@/firebaseConfig';
import { useRouter } from 'next/router';
// import { redirect } from "next/navigation";
const initialState =  {
    username: "",
    email: "",
    photoUrl: "",
    uid: "",
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
        anotherLogin: (state, action) => {
            console.log("anotherLogin in");
            state.username = 'manoj';
            // state.email = action.payload.email;
            // state.isLogged = true;
        },

       
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action:any) => {
            console.log("user ff", action.payload);
            state.username = action.payload.displayName || 'guest';

            state.email = action.payload.email;
            state.photoUrl = action.payload.photoUrl;
            // state.password = action.payload.password;
            state.uid = action.payload.uid;
            state.isLogged = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.username = "";
            state.email = "";
            // state.password = "";
            state.photoUrl = "";
            state.isLogged = false;
        });
    }
});



export const  anotherLoginInit = (arg:any) => (dispatch:any, getstate:any) => {
    console.log("anotherLoginInit", arg);
    const {userinfo} = getstate();
    console.log("state", userinfo);
    dispatch(anotherLogin(arg));
}







export const login = createAsyncThunk("user/login", async(action:any) =>  {

    console.log("login");
    console.log("auth", action);
    // console.log("auth", okay);

    if (auth.currentUser) {
        console.log('logcurrent', auth.currentUser.displayName)
        const user = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            // password: auth.currentUser.password,
        
        }
        // await addData({...user,uid:auth.currentUser.uid,isOnline:true})
        return user;
    }
        

    // 
    let user:any = null;
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
        photoUrl: user.photoURL,
        uid: user.uid,
    }
    return userObj;
});


export const logout = createAsyncThunk("user/logout", async () => {
    await auth.signOut();
    return;
}
);





export const { anotherLogin } = userSlice.actions;
export default userSlice.reducer;