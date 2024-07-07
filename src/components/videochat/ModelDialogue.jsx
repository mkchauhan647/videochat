// Simple model when on video-call event is emitted, the server will send the event to the user that is being called.
import { useSelector,useDispatch } from "react-redux";
import { setIsReceivingCall, setLocalStream } from "./peerConnection";


export default function ModelDialogue({props}) {

    console.log("from", props);

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

       
        

        await peerConn.peerConnection.setRemoteDescription(new RTCSessionDescription(peerConn.callerSignal));
        const answer = await peerConn.peerConnection.createAnswer();
        await peerConn.peerConnection.setLocalDescription(answer);
        socket.emit('call-accepted', { answer: answer, to: peerConn.callerId });
        dispatch(setIsReceivingCall(false));

    }
    const handleRejectCall = () => {
        console.log("call rejected");
    }

    return (
        <>
            <div className="flex fixed top-0 bottom-0 left-0 right-0  w-screen justify-center items-center h-screen  bg-transparent z-10">
                <div className="flex flex-col bg-[#bcbbbad6] w-96 h-96 justify-center items-center gap-5 rounded-sm">
                    <p>Incoming Call from {props.from} ... </p>
                    <div className="flex justify-center items-center gap-5 ">
                        <button className="bg-green-400 p-2" onClick={handleAcceptCall}>Accept</button>
                        <button className="bg-red-400 p-2" onClick={handleRejectCall}>Reject</button>
                        </div>
               </div>
            </div>
        </>
    )

};