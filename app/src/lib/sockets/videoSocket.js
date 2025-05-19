/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { io } from 'socket.io-client';
import useStore from '../utils/store.js';
import { SOCKET_BASEURL } from '../config/env.js';

// Initialize socket connection to the video-calling-io namespace
const socket = io(`${SOCKET_BASEURL}/video-calling-io`, {

  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  forceNew: true,
  transports: ['websocket'],
  query: {
    userId: useStore.getState().userId
  },
  
});

// Log socket connection status for debugging
socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

export default socket;