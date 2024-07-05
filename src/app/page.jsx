"use client";
import VideoChat from "@/components/videochat/Videochat";
import Chat from "@/components/chat/Chat";
import Profile from "@/components/Profile/Profile";
import SearchBox from "@/components/SearchBox/SearchBox";
import {  useEffect, useState } from "react";
import { anotherLoginInit, login, logout } from "@/store/userinfo/userinfo";
import { handleSocket, initializeSocket, setChatMode }  from "@/store/socketListener/socketListener";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig/firebaseConfig";
import { addData, updateData, getData } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import { setRemoteStreamId,createPeerConnection } from "@/components/videochat/peerConnection";
import { setOnlineUsers } from "@/store/onlineUsers/onlineUsers";

export default function Home() {
  const userInfo = useSelector((state) => {
    // console.log("state", state);
    return state.userinfo;
  });

  const socketState = useSelector((state) => state.socketListener);
  const peerConn = useSelector((state) => state.peerConnection);
  const [selectedUser, setSelectedUser] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const chatMode = useSelector((state) => state.socketListener.chatMode);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
        dispatch(login());
        window.addEventListener("beforeunload", function (e) {
          // Custom message is not supported in most modern browsers
          var confirmationMessage = "Are you sure you want to leave this page?";

          // Standard for most modern browsers
          const returnValue = updateData("onlineusers", {
            username: user.displayName,
            uid: user.uid,
            isOnline: false,
          });
          // e.returnValue = "Hello";

          // For some older browsers

          return confirmationMessage;
        });
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      } else {
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
          router.refresh();
      }
    });
    
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
        const onlineUsers = data.filter(
          (user) => user.isOnline && user.uid !== userLocal.uid
        );
        // setOnlineUsers(onlineUsers);
        console.log('onuer',onlineUsers)
        dispatch(setOnlineUsers(onlineUsers));
      });
      if (!socketState.socket && userInfo.uid != '') {
        console.log("userinfoss",userInfo);
        // dispatch(initializeSocket("", userInfo.uid));
        dispatch(initializeSocket("videocall", userInfo.uid));
        dispatch(createPeerConnection());
      }
    }



  }, [userInfo]);

  useEffect(() => {
   console.log("Re-rendering !!!")
 })

  const handleVideoConnection = (user) => {



    console.log("chat connection");
    console.log("socket", socketState.socket);

    // setSelectedUser(user);
    alert("user Selected for Vide call " + user.username);
    dispatch(setRemoteStreamId(user));
    if (chatMode) {
      socketState.socket.emit('chat-connection', { from: userInfo, to: peerConn.remoteStreamId });
    }

    // socketState.socket.emit("video-call", { username: userInfo.username, room: "room1" });

  };
  const handleSelection = (e) => {
    
    const selectedUser = e.target.value;
    console.log('selectedUser',selectedUser)
    const user = onlineUsers.find(user => user.username === selectedUser);
    console.log('user',user)
    dispatch(setRemoteStreamId(user));
    socketState.socket.emit('chat-connection', { from: userInfo, to: user });
    dispatch(setChatMode(true));
    // socket.emit('chat-connection', { from: userInfo, to: peerConn.remoteStreamId });


  }



  return (
    <>
      {userInfo && (userInfo.username || userInfo.email) ? (
        <>
          <div className="flex relative  flex-col p-2 h-screen">
            <div className="flex flex-wrap gap-5 relative justify-around  py-4 bg-red0">
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
              <p className="text-sm text-gray-500 self-start p-1">
                Currently logged in Users:
                {onlineUsers &&
                  onlineUsers.map((user, index) => {
                    return (
                      <span
                      key={index}
                      className="text-blue-400 cursor-pointer"
                      onClick={() => {
                        handleVideoConnection(user);
                      }}
                    >
                      {" "}
                      {user.username},{" "}
                    </span>
                    )
                  })}
              </p>
            </div>
            <div className="flex md:flex-col justify-center  items-center mt-5 gap-8  md:p-2">
              <VideoChat selectedUser={selectedUser} />
              {/* <VideoChat /> */}
              <Chat />
              {<div>
          <h1 className="text-center">Chatting with </h1>
                <select onChange={handleSelection}>
                <option value="" disabled selected>Select a user</option>
            { onlineUsers && onlineUsers.map((user,index)=>{
              return <option key={index} value={user.username}>{user.username}</option>
            })}
          </select>
          </div>}
            </div>
          </div>
        </>
      ) : (
        <Login login={login} />
      )}
    </>
  );
}
