
export function createPeerConnection() {
    const peerConnection = new RTCPeerConnection();
    // peerConnection.onicecandidate =

    // peerConnection.onicecandidate = handleIceCandidate;
    // peerConnection.ontrack = handleTrack;

    return peerConnection;
}