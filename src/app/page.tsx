'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";
import io from 'socket.io-client'
export default function Home() {

  const ioRef = useRef(null);
  const roomId = useRef(null);
  const messageInput = useRef('');

  const joinRoom = () => {
    const socket = ioRef.current;
    socket.emit('joinRoom', roomId.current.value);
  }


  const sendMessage = () => {
    const socket = ioRef.current;

    socket.emit('sendMessage', {message:messageInput.current.value,roomId:roomId.current.value  ? roomId.current.value : 0})
  }

  const displayMessage = (message:string) => {

    const messageContainer = document.getElementById('messages');
    const ele = document.createElement('p');
    ele.innerText = message + ' Check';
    messageContainer?.appendChild(ele);
    return;

  }


  useEffect(() => {
    if (!ioRef.current) {
      const socket = io.connect('https://localhost:3001/multiChat');
      ioRef.current = socket;

      socket.on('rcv', (data: any) => {
        console.log("Event rcv fired !")
        const msg = JSON.parse(data);
        displayMessage(msg.message);
        
      })

      socket.on('roomJoined', (data: any) => {
        console.log('New user has joined this chat !')
        displayMessage('new user has joined this chat !');
      })

      // socket.on('receivedMessage', (data: any) => {
      //   console.log("Event rcv fired !")
      //   const msg = JSON.parse(data);
      //   displayMessage(msg.message);
      // })

    }
  },[])



  return (
    <>
    
      <div className="flex flex-col justify-center items-center gap-4 mt-20">
      <h1>Video Call</h1>
      <h1>Audio  Call</h1>
      <p>Enter Your room Id:</p>
      <input ref={roomId} type="number" placeholder="enter room id to join" className="p-4 border border-black"/>
      <button type="submit" onClick={joinRoom} className="p-2 bg-green-500" >Join Room</button>
      <input ref={messageInput} type="text" placeholder="message... " className="p-4 border border-black" />
      <button type="submit" onClick={sendMessage} className="p-2 bg-blue-500">Send Message</button>
      <div id="messages">

      </div>
      </div>
    </>
  );
}
