"use client";
import VideoChat from "@/components/videochat/Videochat";
import Chat from "@/components/chat/Chat";
import Profile from "@/components/Profile/Profile";
import SearchBox from "@/components/SearchBox/SearchBox";
import {  useEffect, useState } from "react";
import { login, logout } from "@/store/userinfo/userinfo";
import { handleSocket, initializeSocket }  from "@/store/socketListener/socketListener";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig/firebaseConfig";
import { addData, updateData, getData } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";


export default function Home() {
  const userInfo = useSelector((state) => {
    // console.log("sst", state.userInfo);
    // if (state.userInfo) {
    //   return state.userInfo;
    // }
    // console.log("w", window.localStorage.getItem("user"));
    // const returnstate = JSON.parse(window.localStorage.getItem("user"));
    return state.userinfo;
  });

  const socketState = useSelector((state) => state.socketListener);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const router = useRouter();

  console.log("home", userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("hello");
  console.log("home", userInfo);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("okay", user);
        console.log("okay", user);
        console.log("okay", user);
        console.log("okay", user);
        addData({ username: user.displayName, uid: user.uid, isOnline: true });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            isLogged: true,
            uid: user.uid,
          })
        );
        console.log("calling",)
        dispatch(login());
        // Clean up when the user logs out or the window is closed
        // window.onclo
        window.addEventListener("beforeunload", function (e) {
          // Custom message is not supported in most modern browsers
          var confirmationMessage = "Are you sure you want to leave this page?";

          // Standard for most modern browsers
          console.log("userid", auth.currentUser.uid);
          console.log("userid", user.uid);

          const returnValue = updateData("onlineusers", {
            username: user.displayName,
            uid: user.uid,
            isOnline: false,
          });
          // e.returnValue = "Hello";

          // For some older browsers

          return confirmationMessage;
        });
        // Clean up when the component is unmounted or the user logs out
        // return () => {
        //   window.removeEventListener('beforeunload', handleBeforeUnload);
        // };
      } else {
        console.log("not okay", auth);
        const user = JSON.parse(window.localStorage.getItem("user"));
        if (user) {
          console.log("not okally");

          updateData("onlineusers", {
            username: user.username,
            uid: user.uid,
            isOnline: false,
          });
        }
          window.localStorage.removeItem("user");
          // router.push('/lasun')
          // dispatch(logout());
          router.refresh();
        console.log('refreshed')
      }
    });
    console.log("userinfo",userInfo)

    return () => {
      unsubscribe();
    };
  }, [userInfo]);

  useEffect(() => {
    const userLocal = JSON.parse(window.localStorage.getItem("user"));
    console.log("userLocal", userLocal);



    if (userLocal && userLocal.isLogged) {
      console.log("userinfo getting data");
      getData("onlineusers").then((data) => {
        console.log("data", data);
        const onlineUsers = data.filter(
          (user) => user.isOnline && user.uid !== userLocal.uid
        );
        setOnlineUsers(onlineUsers);
      });
      // dispatch(handleSocket());
      // initializeSocket(dispatch);
      console.log("socketState", socketState);
      if (!socketState.socket) {
        dispatch(initializeSocket("chat"));
      }
    }

  }, []);

  const handleChatConnection = () => {
    console.log("chat connection");
    console.log("socket", socketState.socket);
    socketState.socket.emit("join", { username: userInfo.username, room: "room1" });

    // // socke
    // const socket = io("http://localhost:3001/chat");
    // socket.emit("join", { username: userInfo.username, room: "room1" });

  };

  const handleLogout = () => {

    // window.localStorage.removeItem("user");
    // router.refresh();

    return;
  }


  // if (auth.currentUser) {
  //   return (
  //     <>
  //       <div className="flex justify-center items-center h-screen">
         
  //           <p className="">Loding .... </p>
  //         <div className="relative animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#333]"> 
  //         </div>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      {userInfo && (userInfo.username || userInfo.email) ? (
        <>
          <div className="flex relative  flex-col p-2 h-screen">
            <div className="flex flex-wrap gap-5 relative justify-around  py-8 bg-red0">
              <SearchBox onlineUsers={onlineUsers} />
              <Profile userInfo={userInfo} />
            </div>
            <div className=" bg-slate-300 w-[83%] mx-auto flex flex-col justify-center items-center gap-1">
              <h1 className="text-xl p-1">Welcome {userInfo.username}</h1>
              <button
                onClick={() => dispatch(logout())}
                className="bg-blue-400 p-2 rounded-full"
              >
                Logout
              </button>
              {/* <h1 className="text-xl">Select the user to chat with:</h1> */}
              <p className="text-sm text-gray-500 self-start p-1">
                Currently logged in Users:
                {onlineUsers &&
                  onlineUsers.map((user, index) => (
                    <span
                      key={index}
                      className="text-blue-400 cursor-pointer"
                      onClick={() => {
                        handleChatConnection();
                      }}
                    >
                      {" "}
                      {user.username},{" "}
                    </span>
                  ))}
              </p>
            </div>
            <div className="flex md:flex-col justify-center  items-center mt-5 gap-8  md:p-2">
              <VideoChat />
              {/* <VideoChat /> */}
              <Chat />
            </div>
          </div>
          {/* <button onClick={() => logout()}>Logout</button> */}
        </>
      ) : (
        <Login login={login} />
      )}
    </>
  );
}
