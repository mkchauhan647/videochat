import { createSlice } from "@reduxjs/toolkit";
import { setChatMode,setMessage } from "@/store/socketListener/socketListener";
const initialState = {
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    remoteStreamId: null,
    isCalling: false,
    isReceivingCall: false,
    callerSignal: null,
    callerId: null,
    callAccepted: false,
    callEnded: false,
    callingDialogOpen: false,
    callRejected: false
};

const peerConnectionSlice = createSlice({
    name: "peerConnection",
    initialState,
    reducers: {
        setPeerConnection: (state, action) => {
            state.peerConnection = action.payload;
        },
        setLocalStream: (state, action) => {
            state.localStream = action.payload;
        },
        setRemoteStream: (state, action) => {
            state.remoteStream = action.payload;
        },
        setRemoteStreamId: (state, action) => {
            state.remoteStreamId = action.payload;
        },
        setIsCalling: (state, action) => {
            state.isCalling = action.payload;
        },
        setIsReceivingCall: (state, action) => {
            state.isReceivingCall = action.payload;
        },
        setCallerSignal: (state, action) => {
            state.callerSignal = action.payload;
        },
        setCallerId: (state, action) => {
            state.callerId = action.payload;
        },
        setCallAccepted: (state, action) => {
            state.callAccepted = action.payload;
        },
        setCallEnded: (state, action) => {
            state.callEnded = action.payload;
        },
        setCallingDialogOpen: (state, action) => {
            state.callingDialogOpen = action.payload;
        },
        setCallRejected: (state, action) => {
            state.callRejected = action.payload;
        }
    }
});


export const {
    setPeerConnection,
    setLocalStream,
    setRemoteStream,
    setRemoteStreamId,
    setIsCalling,
    setIsReceivingCall,
    setCallerSignal,
    setCallerId,
    setCallAccepted,
    setCallEnded,
    setCallingDialogOpen,
    setCallRejected
} = peerConnectionSlice.actions;

export default peerConnectionSlice.reducer;

// Function to create peer connection

export const createPeerConnection = () => (dispatch, getState) => {
    const { peerConnection } = getState();
    if (peerConnection.peerConnection === null) {
        // const peerConnection = new RTCPeerConnection();
        const peerConn = initializePeerConnection(dispatch, getState);
        dispatch(setPeerConnection(peerConn));
    }
           
}

const initializePeerConnection = (dispatch, getState) => {

    const peerConn = new RTCPeerConnection();
    const { socketListener } = getState();
    const socket = socketListener.socket;

    peerConn.onicecandidate = (e) => {
        if (e.candidate ) {
            const { peerConnection } = getState();
            // console.log('sending candidate', e.candidate,peerConnection.remoteStreamId);
            // console.log('sending candidate', e.candidate,peerConnection.remoteStreamId);
            if (peerConnection.callerId) {
                console.log('sending candidate inside recv', e.candidate,peerConnection.callerId);
                socket.emit("candidate", { candidate: e.candidate, to:peerConnection.callerId });
            }
            else {
                socket.emit("candidate", { candidate: e.candidate, to:peerConnection.remoteStreamId });
            }
        }
    };

    peerConn.ontrack = (e) => {
        dispatch(setRemoteStream(e.streams[0]));
    }

    // socketListener.socket.emit("call-user", { offer, to: peerConnection.remoteStreamId });
    socket.on('video-call', (data) => {
        console.log('video calling someone', data)
        dispatch(setCallerSignal(data.offer));
        dispatch(setCallerId(data.from));
        dispatch(setIsReceivingCall(true));
    })

    socket.on('candidate', (data) => {
        if (peerConn.remoteDescription) {
            
            peerConn.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    
    })

    socket.on('call-accepted', (data) => {
        peerConn.setRemoteDescription(data.answer);
        dispatch(setCallAccepted(true));
        // dispatch(set)
    });

    socket.on('call-ended', () => {
        peerConn.close();
        dispatch(setCallEnded(true));
    });

    socket.on('chat-connection', (data) => {
        console.log("chat connection event", data);

        // const ans = confirm(data.from.username + "Send Chat Request. Do you want to accept?");

        // if (ans) {
        //     dispatch(setRemoteStreamId(data.from));
        //     dispatch(setChatMode(true));
        //     socket.emit('chat-accepted', { from: data.to, to: data.from });
        //     return;
        // }
        // dispatch(setRemoteStreamId(data.from));
        // dispatch(setChatMode(true));
        socket.emit('chat-accepted', { from: data.to, to: data.from });
        return;
        // socket.emit('chat-rejected', data);
    });

    socket.on('chat-accepted', (data) => {
        console.log("chat accepted event", data);
        // dispatch(setChatMode(true));
        // dispatch(setRemoteStreamId(data.from));
        // dispatch(setMessage({...data,message:"Start Conversations !"}));

    });

    socket.on('chat-rejected', (data) => {
        console.log("chat rejected event", data);
        dispatch(setChatMode(false));
        dispatch(setMessage({ message: "Chat Rejected" }));
    });



    return peerConn;

};