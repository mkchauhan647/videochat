"use client";
import { useRef, useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function Chat() {

  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socketListener.socket);
  const message = useSelector((state) => state.socketListener.message);
  console.log('messageremote',message)
  const messageInputRef = useRef("");
  const messagesEndRef = useRef("");
  // const messageContainerRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      message: 'Welcome to the chat room!',
    type: '',
   }
  ]);
    
  useEffect(() => {
    if (message.message) {
      setMessages((prevState) => [...prevState, { message: message.message, type: 'received' }]);
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
    setMessages((prevState) => [...prevState, { message:messageInputRef.current.value, type: 'sent' }]);

    console.log('msss',messages)



    socket.emit("message", {message:messageInputRef.current.value, room: "room1"});
    
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
      
  }, [messages]);

  return (
   
    // <h1 className="h-[100%] text-center bg-black">Hello chat</h1>
    <>
    
      <div className="flex flex-col  h-[450px]  w-[30%] md:h-[400px] md:w-full bg-[#ddd] justify-end gap-5 ">


        <div className=" overflow-auto p-2  ">
          {messages.map((message, index) => (
            <div key={index} className={message.type == 'sent' ? " bg-blue-400 rounded-full p-2 mt-3 " : " bg-white dark:bg-[#333] rounded-full p-2 mt-3"}>
              {message.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
       
        <div className="flex justify-betwee gap-4 md:flex-col items-center p-2">
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
          </div>



        
      </div>
    
    </>

  );
}
