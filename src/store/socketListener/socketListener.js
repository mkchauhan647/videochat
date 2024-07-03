import { createSlice } from "@reduxjs/toolkit";
// import { initializeSocketEvents } from "./initializeSocketEvents"; // Adjust the path as per your project structure
import { io } from "socket.io-client";
const initialState = {
  socket: null,
  message: {message:''},
  connected: false
};

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
    }
  }
});

export const { setSocket, setMessage, setConnected } = socketListenerSlice.actions;

// Thunk action creator for initializing socket
export const initializeSocket = (namespace) => (dispatch, getState) => {
  const { socketListener } = getState();
  if (!socketListener.socket) {
    const socket = initializeSocketEvents(namespace, socketListener, dispatch);
    dispatch(setSocket(socket));
  }
};

export default socketListenerSlice.reducer;



export const initializeSocketEvents = (namespace, state, dispatch) => {
    const socket = io(`https://192.168.1.65:3001/${namespace}`, {
      rejectUnauthorized: false
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
    dispatch(setMessage({message:message}));
  });

  return socket;
};
