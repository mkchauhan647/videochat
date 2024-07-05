import { createSlice } from "@reduxjs/toolkit";
// import { initializeSocketEvents } from "./initializeSocketEvents"; // Adjust the path as per your project structure
import { io } from "socket.io-client";
const initialState = {
  namespace:{},
  message: {message:''},
  connected: false,
  chatMode:false,
};

/**
 * Slice for socket listener
 * @param {object} state - The initial state of the socket listener
   okay to this 
 */
const socketListenerSlice = createSlice({
  name: "socketListener",
  initialState,
  reducers: {
    // Reducer for initializing socket
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    // Reducer for setting message
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    // Reducer for setting connection status
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setChatMode: (state, action) => {
      state.chatMode = action.payload;
    }

  }
});

export const { setSocket, setMessage, setConnected,setChatMode } = socketListenerSlice.actions;

// Thunk action creator for initializing socket
export const initializeSocket = (namespace) => (dispatch, getState) => {
  const { socketListener } = getState();
  if (!socketListener.socket) {
    const socket = initializeSocketEvents(namespace, socketListener, dispatch,getState);
    dispatch(setSocket(socket));
  }
};

export default socketListenerSlice.reducer;


// Function to initialize socket events
/** 
 Function to initialize socket eventsand slices
 */

export const initializeSocketEvents = (namespace, state, dispatch,getState) => {
  const { userinfo } = getState();
  console.log('userinfo',userinfo);
    // const socket = io(`https://192.168.1.65:3001/${namespace}`, {
    const socket = io(`https://witty-suave-dormouse.glitch.me/${namespace}`, {
      rejectUnauthorized: false,
      query: {
          uid: userinfo.uid
      }
  });

  socket.on('connect', () => {
    console.log('connected');
    dispatch(setConnected(true));
    dispatch(setMessage('connected'));
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    dispatch(setConnected(false));
  });

  socket.on('message', (message) => {
    console.log('message', { room: 'room1', message });
    dispatch(setMessage(message));
  });

  return socket;
};

