"use client";
import { setMessage } from "@/store/socketListener/socketListener";
import { useRef, useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setChatMode } from "@/store/socketListener/socketListener";
import { addMessages,getMessages } from "@/firebaseConfig";
export default function Chat() {

  const dispatch = useDispatch();
  // const [chatMode, setChatMode] = useState(false);
  const chatMode = useSelector((state) => state.socketListener.chatMode);
  const socket = useSelector((state) => state.socketListener.socket);
  const message = useSelector((state) => state.socketListener.message);
  const peerConn = useSelector((state) => state.peerConnection);
  const userInfo = useSelector((state) => state.userinfo);
  const onlineUsers = useSelector((state) => state.userinfo.onlineUsers);

  console.log('messageremote', message)
  const messageInputRef = useRef("");
  const messagesEndRef = useRef("");
  // const messageContainerRef = useRef(null);
  const [messages, setMessages] = useState({
      user: [{
        message: 'Welcome to chat',
        uid: ''
      }]
  });
  
  useEffect(() => {
    
  },[messages])
    
  useEffect(() => {
    if (message.message) {
      setMessages((prevState) => ({...prevState, [message.from.uid]: [...(prevState[message.from.uid] || []), { message: message.message, uid: message.from.uid}]}));
      // addMessages({ uid: message.from.uid, message: {message:message.message,type:'received'} });
      
    }
  },[message])
  
  const handleSendMessage = () => {
    // const msgContainer = messageContainerRef.current;
    // const msgElement = document.createElement('p');
    // const style = " bg-black rounded-full p-2 "
    // const attributeName = 'className'
    // msgElement.setAttribute(`${attributeName}`,style)
    console.log("msg", message);
    if (messageInputRef.current.value == "") {
      messageInputRef.current.focus();
      return;
      }
      console.log('hello',messageInputRef.current.value)
    // setMessages((prevState) => [...prevState, messageInputRef.current.value]);
    // setMessages((prevState) => [...prevState, { message:messageInputRef.current.value, type: 'sent' }]);
    setMessages((prevState) => ({...prevState, [peerConn.remoteStreamId.uid]: [...(prevState[peerConn.remoteStreamId.uid] || []), { message: messageInputRef.current.value, uid:userInfo.uid }]}));
    addMessages({ uid: (peerConn.remoteStreamId.uid + userInfo.uid).split('').sort().join(''), message: {message:messageInputRef.current.value,uid:userInfo.uid} });

    console.log('msss',messages)



    socket.emit("message", {message:messageInputRef.current.value, from:userInfo, to:peerConn.remoteStreamId});
    
    //   messageInputRef.current.value = '';
    // msgElement.innerText = messageInputRef.current.value;
    // msgContainer.appendChild(msgElement);
    return;
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

    useEffect(() => {
        scrollToBottom();
      // messageInputRef.current.value = '';
      async function addMessagesAsync() {
        // await addDoc(collection(db,''))
        await addMessages({ uid: peerConn.remoteStreamId.uid, messages: messages[peerConn.remoteStreamId.uid] });
        }
      
  }, [messages]);


  const handleChatConnection = () => {
    // dispatch(initializeSocket())
    // const socket = io('https://192.168.1.65:3001/chat');

    // socket.on('chat-accepted', (data) => {
    //   console.log('chat accepted', data)
    
    //   dispatch(setMessage(data.message))

    // })
    // socket.on('chat-accepted', (data) => {
    //   console.log('chat accepted', data)
    //   dispatch(setChatMode(true));
    //   dispatch(setMessage({ message: "Chat Accepted" }));
    //   // setChatMode(true);

    // })

    // socket.on('message', (data) => {
    //   console.log('message received', data)
    //   dispatch(setMessage(data.message))
    // })

  }

  useEffect(() => {
    async function getMessagesAsync() {
      const messages = await getMessages((peerConn.remoteStreamId.uid + userInfo.uid).split('').sort().join(''));
      // setMes
      console.log('changeid', messages);
      setMessages((prevState) => ({...prevState, [peerConn.remoteStreamId.uid]: messages}));
    }
    if(peerConn.remoteStreamId) {
      getMessagesAsync();
    }
  },[peerConn.remoteStreamId])



  return (
   
    // <h1 className="h-[100%] text-center bg-black">Hello chat</h1>
    <>
    
      <div className="flex flex-col  h-[450px]  w-[30%] md:h-[400px] md:w-full bg-[#ddd] justify-end gap-5 ">

      

        <div className=" overflow-auto p-2  ">
          {peerConn.remoteStreamId && messages[peerConn.remoteStreamId.uid]?.map((message, index) => {
            // console.log(peerConn.remoteStreamId.username)
            return (<div key={index} className={message.uid == userInfo.uid ? " bg-blue-400 rounded-full p-2 mt-3 " : " bg-white dark:bg-[#333] rounded-full p-2 mt-3"}>
              {message.message}
            </div>)
          })}
          <div ref={messagesEndRef} />
        </div>
       
        <div className="flex justify-betwee gap-4 md:flex-col items-center p-2">
          {
            chatMode ? <>
            <input
            type="text"
            ref={messageInputRef}
            className="w-[80%] p-2 rounded-full dark:bg-black"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-400 p-2 rounded-full px-4 md:w-[50%]"
          >
            {/* <IoSendSharp /> */}
            Send
          </button>
            </>
              // :  peerConn.remoteStreamId ? <p onClick={handleChatConnection}>Start Chatting with {peerConn.remoteStreamId.username}</p> : <p>Select User To Chat With !!!</p>
              : <p>Select User To Chat With !!!</p>
          }
          </div>



        
      </div>
    
    </>

  );
}
