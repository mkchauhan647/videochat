// Simple model when on video-call event is emitted, the server will send the event to the user that is being called.
import { useSelector,useDispatch } from "react-redux";
import { createPeerConnection, setCallEnded, setCallRejected, setIsCalling, setIsReceivingCall, setLiveCalling, setLocalStream, setPeerConnection, setRemoteStream,resetState } from "./peerConnection";
import { setSocket } from "@/store/socketListener/socketListener";


export default function ModelDialogue({props}) {

    console.log("from", props);
    const iscalling = useSelector((state) => state.peerConnection.isCalling);

    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socketListener.socket);
    const peerConn = useSelector((state) => state.peerConnection);
    
    const handleAcceptCall = async () => {
        // console.log("call accepted");
        // dispatch(setRemoteStreamId());
        console.log("accpetcall",peerConn);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});

        console.log("localstream", stream);


        dispatch(setLocalStream(stream));
        stream.getTracks().forEach(track => {
            peerConn.peerConnection.addTrack(track, stream);
        })

       
        

        // await peerConn.peerConnection.setRemoteDescription(new RTCSessionDescription(peerConn.callerSignal));
        const answer = await peerConn.peerConnection.createAnswer();
        await peerConn.peerConnection.setLocalDescription(answer);
        socket.emit('call-accepted', { answer: answer, to: peerConn.callerId });
        dispatch(setIsReceivingCall(false));
        dispatch(setLiveCalling(true));

    }
    const handleRejectCall = () => {
        console.log("call rejected");
        dispatch(setIsReceivingCall(false));
        dispatch(setIsCalling(false));
        dispatch(setLocalStream(null));
        dispatch(setRemoteStream(null));
        dispatch(setLiveCalling(false))
        socket.emit('call-rejected', { to: peerConn.callerId });
        // peerConn.peerConnection.close();
        if (peerConn.localStream) {
            peerConn.localStream.getTracks().forEach(track => track.stop());
        }
        peerConn.peerConnection.close();

        // const resetPeer = new RTCPeerConnection();

        // dispatch(setPeerConnection(resetPeer));

        dispatch(setPeerConnection(null));
        dispatch(setSocket(null));

    }

    const handleEndCall = () => {
        console.log("call ended");
        peerConn.localStream.getTracks().forEach(track => track.stop());
         
        peerConn.peerConnection.close();
        
        // const resetPeer = new RTCPeerConnection();
        
        // dispatch(setPeerConnection(resetPeer));

        dispatch(setIsCalling(false));
        dispatch(setIsReceivingCall(false));
        dispatch(setLocalStream(null));
        dispatch(setRemoteStream(null));
        dispatch(setLiveCalling(false))
        // peerConn.peerConnection.close();
       
        socket.emit('call-ended', { to: peerConn.remoteStreamId });
        dispatch(setPeerConnection(null));
        dispatch(setSocket(null));

    }


    const receiverDialogue = () => {
        return (
            <>
                <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-xl text-white">Incoming Call</h1>
                        <div className="flex gap-5">
                            <button className="bg-green-500 text-white rounded-md px-2 py-1" onClick={handleAcceptCall}>Accept</button>
                            <button className="bg-red-500 text-white rounded-md px-2 py-1" onClick={handleRejectCall}>Reject</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const senderDialogue = () => {

        

        return (
            <>
                <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-xl text-white">Calling</h1>
                        <div className="flex gap-5">
                            <button className="bg-red-500 text-white rounded-md px-2 py-1" onClick={handleEndCall}>End Call</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }





    const renderModelDialogue = () => {

        if (props.compo === 'receiver') {
            return receiverDialogue();
        }

        else if (props.compo === 'sender') {
            return senderDialogue();
        }

        else if (props.compo === 'rejected') {
            return (
                <>
                    <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                        <div className="flex flex-col gap-5">
                            <h1 className="text-xl text-white bg-red-500">Call Rejected</h1>
                            <button className="bg-red-500 text-white rounded-md px-2 py-1" onClick={() => {
                                dispatch(setCallRejected(false));
                                // dispatch(createPeerConnection());
                                dispatch(setPeerConnection(null));
                                dispatch(setSocket(null));
                                // dispatch(resetState());


                            }}>Close</button>

                        </div>
                    </div>
                </>
            )
        }

        else if(props.compo === 'ended'){
            return (
                <>
                    <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                        <div className="flex flex-col gap-5">
                            <h1 className="text-xl text-white bg-red-500">Call Ended</h1>
                            <button className="bg-red-500 text-white rounded-md px-2 py-1" onClick={() => {
                                dispatch(setCallEnded(false))
                                // dispatch(createPeerConnection());
                                // dispatch(resetState());
                                // dispatch(setPeerConnection(null));
                                // dispatch(setSocket(null));


                            }
                            }>Close</button>
                        </div>
                    </div>
                </>
            )
        }
            
            else {
                return;
            }
    }




    return (
        <>
            <div className="flex fixed top-0 bottom-0 left-0 right-0  w-screen justify-center items-center h-screen  bg-transparent z-10">
                <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                    {
                        renderModelDialogue()
                   }
               </div>
            </div>
        </>
    )

};