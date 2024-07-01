import io from 'socket.io-client'
import { createPeerConnection } from './peerConnection';

let socket;
export function createSocketConnection() {
    
    socket = io('https://localhost:3001/videochat');

   

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('candidate', handleCandidate);
    return socket;

}

const handleAnswer = async (offer) => {

    const peerConnection = createPeerConnection();

    peerConnection.setLocalDescription();
        
}

const handleCandidate = async () => {

}

const handleOffer = async () => {
    
}

export const getUserMedia = async (peerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    return stream;

}