"use client";
import { useRef, useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
export default function Chat() {
  const messageInputRef = useRef("");
  const messagesEndRef = useRef("");
  // const messageContainerRef = useRef(null);
  const [messages, setMessages] = useState([
    " hello my name is manoj",
    "hello my name is manoj",
    "hello my name is manoj",
    "hello my name is manoj"
  ]);
    
  
  const handleSendMessage = () => {
    // const msgContainer = messageContainerRef.current;
    // const msgElement = document.createElement('p');
    // const style = " bg-black rounded-full p-2 "
    // const attributeName = 'className'
    // msgElement.setAttribute(`${attributeName}`,style)
    if (messageInputRef.current.value == "") {
      messageInputRef.current.focus();
      return;
      }
      console.log(messageInputRef.current.value)
      setMessages((prevState) => [...prevState, messageInputRef.current.value]);
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
    <div className=" m-2 flex flex-col h-[63vh]  py-4  pl-4 pr-2 basis-[27%] md:w-full  bg-[#ddd] justify-end gap-5">
      <div
        id="messages"
        // ref={messagesEndRef}
        className="md:h-[63vw]  overflow-auto"
      >
        {messages &&
          messages.map((message, index) => {
            return (
              <p
                className=" bg-[#ffffff] p-2 my-2 mr-4 rounded-md odd:bg-blue-500 dark:text-black odd:text-white"
                key={index}
              >
                {message}
              </p>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-4 pr-2">
        <textarea
          ref={messageInputRef}
          className=" p-2 w-full rounded-md text-wrap dark:bg-black resize-none"
          type="text"
          placeholder="Type your message..."
          
        />
        {/* <IoSendSharp className=" text-3xl"/> */}
        <button
          type="submit"
          className="bg-blue-400  text-white rounded-md basis-[40%]"
          onClick={() => handleSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
