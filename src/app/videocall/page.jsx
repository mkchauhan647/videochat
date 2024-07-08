// pages/video-call.js
'use client'
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';


// let socket;

export default function VideoCall() {
  // const [isCallStarted, setIsCallStarted] = useState(false);
  // const localVideoRef = useRef();
  // const remoteVideoRef = useRef();
  // const peerConnection = useRef(new RTCPeerConnection());

  // useEffect(() => {
  //   socket = io('https://192.168.1.65:5000/'); // Your Express server URL

  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then(stream => {
  //       localVideoRef.current.srcObject = stream;
  //       stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
  //     });

  //   peerConnection.current.ontrack = (event) => {
  //     remoteVideoRef.current.srcObject = event.streams[0];
  //   };
  //   console.log('peerConnection', peerConnection.current)

  //   peerConnection.current.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socket.emit('ice-candidate', event.candidate);
  //     }
  //   };

  //   socket.on('offer', async (offer) => {
  //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  //     const answer = await peerConnection.current.createAnswer();
  //     await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
  //     socket.emit('answer', answer);
  //   });

  //   socket.on('answer', async (answer) => {
  //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  //   });

  //   socket.on('ice-candidate', async (candidate) => {
  //     await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const startCall = async () => {
  //   const offer = await peerConnection.current.createOffer();
  //   await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
  //   socket.emit('offer', offer);
  //   setIsCallStarted(true);
  // };

  return (
    <div>
      <h1>WebRTC Video Call</h1>
      {/* <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px' }}></video>
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px' }}></video>
      {!isCallStarted && <button onClick={startCall}>Start Call</button>} */}
    </div>
  );
}
