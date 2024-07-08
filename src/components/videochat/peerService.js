
let peer;
export let remoteStreamCheck = null;
export let localStreamCheck=null;
const initlializePeerConnection = () => {
    peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
        ],
    });

    // peer.onicecandidate = (event) => {
    //     if (event.candidate) {
    //         console.log("New ICE candidate: ", event.candidate);
    //     }
    // };

    // peer.onnegotiationneeded = () => {
    //     console.log("Negotiation needed");
    // };

    // peer.ontrack = (event) => {
    //     console.log("Got remote track:", event.streams[0]);
    // };

    return peer;
}

export const getPeerConnection = () => {
    
    if (!peer) {
        peer = initlializePeerConnection();
    }

    return peer;


}

// export remoteStreamCheck;

export const setRemoteStreamCheck = (stream) => {
    // if (!remoteStreamCheck) {
    //     remoteStreamCheck = stream;
    // }
    remoteStreamCheck = stream;
}

export const setLocalStreamCheck = (stream) => {
    localStreamCheck = stream;
}

export const getRemoteStreamCheck = () => {
    return remoteStreamCheck;
}

export const getLocalStreamCheck = () => {
    return localStreamCheck;
}