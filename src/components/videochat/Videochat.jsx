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

    const handleVideoCall = async () => {
        
        const peerConnection = new RTCPeerConnection();
        const socket = io('https://localhost:3001/videochat')

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });


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
            <div className="flex h-[63vh] basis-[55%] ">

                <video  controls autoPlay muted className=" " />
                {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/c2gSzYLJ8sY?si=IbV5ovoTKBNYZkYb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}

                <button className='p-2 bg-blue-400' onClick={handleVideoCall}>Video Call</button>

                {
                    availableOffers && availableOffers.map((offer, index) => {
                        return <p key={index} onClick={()=>handleAnswer(offer)}>Incoming call from {offer.username}</p>
                    })
                }
                
            
            </div>
        
        </>
    )
}