'use client'

import { io } from 'socket.io-client';
import { createPeerConnection } from './peerConnection';
import { createSockeConnection,getUserMedia } from './socketListener';
import { useEffect, useRef, useState } from "react"
// import 

export default function VideoChat() {

    const [peerConnections, setPeerConnections] = useState({
        peerConnection: null,
        username: '',
    });
    const [username, setUsername] = useState('');
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    // const localVideoRef 
    const [sockets, setSockets] = useState([]);
    const [availableOffers, setAvailableOffers] = useState([]);
    const localVideoRef = useRef(null);

    const handleVideoCall = async () => {
        
        const peerConnection = new RTCPeerConnection();
        const socket = io('https://localhost:3001/videochat')

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        })

        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);

        setLocalStream((prevState) => prevState = stream);
        setPeerConnections((prevState) => ({ ...prevState, peerConnection: peerConnection, username: username }))
        
        socket.emit('video-call',{offer:offer,username:username})
        




    }


    useEffect(() => {


        
    },[])


    return (
        <>
            {/* <h1 className='h-[100%] w-[50%] bg-pink-600'>Hello World</h1> */}
            <div className='flex flex-col items-center justify-between h-[450px] md:h-auto gap-5 md:w-full bg-fred-400'>
                
                <video src='/test.mp4' ref={localVideoRef} controls  muted className='h-[380px] md:h-auto' />
                <button onClick={handleVideoCall} className=' bg-blue-400 p-2  w-full'  > Start Video Call</button>
            </div>
              
        </>
    )
}