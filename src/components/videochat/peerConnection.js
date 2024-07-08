import { createSlice } from "@reduxjs/toolkit";
import { setChatMode,setMessage, setSocket } from "@/store/socketListener/socketListener";
const initialState = {
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    remoteStreamId: null,
    isCalling: false,
    liveCalling:false,
    isReceivingCall: false,
    callerSignal: null,
    callerId: null,
    callAccepted: false,
    callEnded: false,
    callingDialogOpen: false,
    callRejected: false,
    candidateQueue: [],
    
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
        },
        setqueueCandidate: (state, action) => {
            state.candidateQueue.push(action.payload);
        },
        clearCandidateQueue: (state) => {
            state.candidateQueue = [];
        },
        setLiveCalling: (state, action) => {
            state.liveCalling = action.payload;
        },
        resetState: () => initialState, // Reset state action
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
    setCallRejected,
    setqueueCandidate,
    clearCandidateQueue,
    setLiveCalling,
    resetState
} = peerConnectionSlice.actions;

export default peerConnectionSlice.reducer;

// Function to create peer connection

export const createPeerConnection = () => (dispatch, getState) => {
    const { peerConnection } = getState();
    if (peerConnection.peerConnection == null) {
        // const peerConnection = new RTCPeerConnection();
        const peerConn = initializePeerConnection(dispatch, getState);
        dispatch(setPeerConnection(peerConn));
    }
           
}

const initializePeerConnection = (dispatch, getState) => {

    let peerConn = new RTCPeerConnection();
    const { socketListener } = getState();
    const socket = socketListener.socket;

    peerConn.onicecandidate = (e) => {
        if (e.candidate ) {
            const { peerConnection } = getState();
            // console.log('sending candidate', e.candidate,peerConnection.remoteStreamId);
            console.log('sending candidate', e.candidate,peerConnection.remoteStreamId);
            if (peerConnection.callerId) {
                console.log('sending candidate inside recv', e.candidate,peerConnection.callerId);
                socket.emit("candidate", { candidate: e.candidate, to:peerConnection.callerId });
            }
           else {
                console.log("from caller side")
                socket.emit("candidate", { candidate: e.candidate, to:peerConnection.remoteStreamId });
            }
            // socket.emit("candidate", { candidate: e.candidate });

        }
    };


    // peerConn.remoteStream = stream;
    peerConn.ontrack = (e) => {
        console.log("Setting remote Stream !!!", e.streams[0])
        dispatch(setRemoteStream(e.streams[0]));
        // remoteVideoRef.current.srcObject = e.streams[0];
    }


   

    // socketListener.socket.emit("call-user", { offer, to: peerConnection.remoteStreamId });
    socket.on('video-call', async (data) => {
        console.log('video calling someone', data)
        await peerConn.setRemoteDescription(new RTCSessionDescription(data.offer));

        dispatch(setCallerSignal(data.offer));
        dispatch(setCallerId(data.from));
        dispatch(setIsReceivingCall(true));
        dispatch(setRemoteStreamId(data.from));
        dispatch(setChatMode(true));
        
    })

    socket.on('candidate', async (data) => {
            
        await peerConn.addIceCandidate(new RTCIceCandidate(data.candidate))
        
    })

    // socket.on('candidate', (data) => {
    //     console.log("Received candidate", data.candidate);
    //     if (peerConn.remoteDescription) {
    //         console.log("Adding candidate", data.candidate);
    //         peerConn.addIceCandidate(new RTCIceCandidate(data.candidate))
    //             .catch(error => {
    //                 console.error("Error adding received ICE candidate", error);
    //             });
    //     } else {
    //         console.log("Queuing candidate", data.candidate);
    //         dispatch(setqueueCandidate(data.candidate));  // Dispatch an action to queue the candidate
    //     }
    // });
    socket.on('call-accepted', (data) => {
        peerConn.setRemoteDescription(data.answer);
        dispatch(setCallAccepted(true));
        dispatch(setIsCalling(false));
        dispatch(setLiveCalling(true));

        // dispatch(set)
    });
    // socket.on('call-accepted', (data) => {
    //     peerConn.setRemoteDescription(new RTCSessionDescription(data.answer))
    //         .then(() => {
    //             const { peerConnection } = getState();
    //             peerConnection.candidateQueue.forEach(candidate => {
    //                 peerConn.addIceCandidate(new RTCIceCandidate(candidate))
    //                     .catch(error => {
    //                         console.error("Error adding queued ICE candidate", error);
    //                     });
    //             });
    //             dispatch(clearCandidateQueue());  // Clear the queue after processing
    //         })
    //         .catch(error => {
    //             console.error("Error setting remote description", error);
    //         });
    //     dispatch(setCallAccepted(true));
    // });

    socket.on('call-ended', () => {
        // peerConn.close();
        const localStream= getState().peerConnection.localStream;
        console.log('localStream',localStream)

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        peerConn.close();

        // peerConn = new RTCPeerConnection();





        // dispatch(resetState());
        
        dispatch(setLocalStream(null));
        dispatch(setRemoteStream(null));
        dispatch(setIsReceivingCall(false));
        dispatch(setLiveCalling(false));
        
        
        dispatch(setCallEnded(true));
        dispatch(setPeerConnection(null));
        dispatch(setSocket(null));
        
    });

    socket.on('call-rejected', () => {
        console.log("call rejected")
        const localStream = getState().peerConnection.localStream;
        console.log('localStream',localStream)

        localStream.getTracks().forEach(track => track.stop());

        peerConn.close();

        const resetPeer = new RTCPeerConnection();

        dispatch(setPeerConnection(resetPeer));
        dispatch(setIsCalling(false));
        dispatch(setCallRejected(true));
        dispatch(setIsReceivingCall(false));
        dispatch(setLocalStream(null));
        dispatch(setRemoteStream(null));
        peerConn.close();
        dispatch(setPeerConnection(null));
        dispatch(setLiveCalling(false));


        // setTimeout(() => {
        //     dispatch(setCallRejected(false));
        
        // },1500)
    
    })

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
        // return;
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