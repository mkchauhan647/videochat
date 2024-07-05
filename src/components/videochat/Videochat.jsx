'use client'

import { io } from 'socket.io-client';
import { setRemoteStreamId,setLocalStream } from './peerConnection';
import { useEffect, useRef, useState } from "react"
import Draggable from 'react-draggable';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ModelDialogue from './ModelDialogue';


export default function VideoChat({selectedUser}) {
    const peerConn = useSelector((state) => state.peerConnection);
    const socketState = useSelector((state) => state.socketListener);
    const userInfo = useSelector((state) => state.userinfo);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    // const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(null);
    const [sockets, setSockets] = useState([]);
    const [availableOffers, setAvailableOffers] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const handleVideoCall = async () => {
        
        const peerConnection = peerConn.peerConnection;
        console.log('peerConnection', peerConnection);
        const socket = socketState.socket;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        dispatch(setLocalStream(stream))
        // localVideoRef.current.srcObject = peerConn.localStream;
        // remoteVideoRef.current.srcObject = peerConn.remoteStream;
        // dispatch(setLocalStream(stream));
        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        })

        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);

        // setLocalStream((prevState) => prevState = stream);
        // setPeerConnections((prevState) => ({ ...prevState, peerConnection: peerConnection, username: username }))
        
        socket.emit('video-call', { offer: offer, from: userInfo, to: peerConn.remoteStreamId })

        console.log('peerConnection', peerConnection);


    }


    useEffect(() => {

        console.log("Hello world times");

        remoteVideoRef.current.srcObject = peerConn.remoteStream;
        console.log("perremote", peerConn.remoteStream);
        // setRemoteStreams(peerConn.remoteStream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = peerConn.localStream;
           }
        
    }, [peerConn.localStream, peerConn.remoteStream]);

    useEffect(() => {

        // if (remoteVideoRef.current) {
        //     remoteVideoRef.current.srcObject = peerConn.remoteStream;
        //    }
        
    },[peerConn.remoteStream])

    return (
        <>
            {/* <h1 className='h-[100%] w-[50%] bg-pink-600'>Hello World</h1> */}
            <div className='relative flex flex-col items-center justify-between h-[450px] md:h-auto gap-5 md:w-full bg-fred-400'>
                
                <video src='test.mp4' ref={remoteVideoRef} controls  muted className=' h-[380px] md:h-auto' />
                {peerConn.remoteStream && <Draggable>
                    <video ref={localVideoRef}  controls  className='absolute h-56 w-56' />
                </Draggable>}
                <button onClick={handleVideoCall} className=' bg-blue-400 p-2  w-full'  > Start Video Call</button>
                {
                peerConn.isReceivingCall && <ModelDialogue props={{ from: 'manoj', peerConn:peerConn,socket:socketState.socket,localVideoRef:localVideoRef }} />    
                }
              {/* <div>{peerConn.remoteStreamId && peerConn.remoteStreamId.uid}</div> */}

            </div>
              
        </>
    )
}