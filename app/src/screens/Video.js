/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices, RTCView } from 'react-native-webrtc'
import socket from '../lib/sockets/videoSocket'
import useStore from '../lib/utils/store'
import { useNavigation, useRoute } from '@react-navigation/native'

const Video = () => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCalling, setIsCalling] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  
  const navigation = useNavigation()
  const route = useRoute()
  const { targetUserId, isReceivingCall } = route.params || {}
  
  const userId = useStore(state => state.userId)
  const peerRef = useRef(null)
  const roomIdRef = useRef(null)
  
  // Initialize WebRTC
  useEffect(() => {
    // Request camera and microphone permissions
    const getMediaStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: 'user',
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          }
        })
        setLocalStream(stream)
        
        // If receiving a call, wait for the call details
        if (!isReceivingCall && targetUserId) {
          initiateCall()
        }
      } catch (err) {
        console.error('Error getting media stream:', err)
      }
    }

    getMediaStream()
    
    // Setup socket listeners
    socket.on('connected', () => {
      console.log('Connected to video calling socket')
    })
    
    socket.on('give-peer-details', ({ data }) => {
      if (data && data.userId) {
        const receivingUserId = data.userId
        handleCallUser(receivingUserId)
      }
    })
    
    socket.on('call-now', async ({ data }) => {
      if (data && data.signal && data.userId) {
        const callerId = data.userId
        const incomingSignal = data.signal
        handleReceiveCall(callerId, incomingSignal)
      }
    })
    
    socket.on('end-call', (roomId) => {
      if (roomId === roomIdRef.current) {
        endCall()
      }
    })
    
    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      
      if (peerRef.current) {
        peerRef.current.close()
      }
      
      // Remove socket listeners
      socket.off('connected')
      socket.off('give-peer-details')
      socket.off('call-now')
      socket.off('end-call')
    }
  }, [])
  
  // Initiate call when component mounts if we have a targetUserId
  const initiateCall = () => {
    if (targetUserId) {
      setIsCalling(true)
      socket.emit('find-caller-peerId', targetUserId)
    }
  }
  
  // Function to handle outgoing call after finding the peer
  const handleCallUser = (receivingUserId) => {
    // Create RTCPeerConnection
    const peer = createPeerConnection()
    peerRef.current = peer
    
    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream)
    })
    
    // Create and send offer
    peer.createOffer()
      .then(offer => peer.setLocalDescription(offer))
      .then(() => {
        // Send offer to the server to relay to the receiving user
        socket.emit('peer-details', receivingUserId, peer.localDescription)
      })
      .catch(err => console.error('Error creating offer:', err))
  }
  
  // Function to handle incoming call
  const handleReceiveCall = (callerId, incomingSignal) => {
    setIsCalling(true)
    
    // Create RTCPeerConnection
    const peer = createPeerConnection()
    peerRef.current = peer
    
    // Add local stream tracks
    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream)
    })
    
    // Process the incoming signal (offer)
    const desc = new RTCSessionDescription(incomingSignal)
    peer.setRemoteDescription(desc)
      .then(() => peer.createAnswer())
      .then(answer => peer.setLocalDescription(answer))
      .then(() => {
        // Send the answer back
        socket.emit('called', roomIdRef.current)
      })
      .catch(err => console.error('Error handling incoming call:', err))
    
    setCallAccepted(true)
  }
  
  // Helper function to create RTCPeerConnection with proper config
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })
    
    // Handle ICE candidate events
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        // In a production app, you'd relay this to the other peer
        console.log('New ICE candidate', event.candidate)
      }
    }
    
    // Handle incoming stream
    peer.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0])
      }
    }
    
    // Handle connection state changes
    peer.onconnectionstatechange = (event) => {
      console.log('Connection state change:', peer.connectionState)
      if (peer.connectionState === 'connected') {
        setCallAccepted(true)
      } else if (['disconnected', 'failed', 'closed'].includes(peer.connectionState)) {
        endCall()
      }
    }
    
    return peer
  }
  
  // Function to end the call
  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close()
    }
    
    if (roomIdRef.current) {
      socket.emit('call-end', targetUserId || route.params?.callerId, roomIdRef.current)
      socket.emit('leave-call-last', roomIdRef.current)
    }
    
    setCallEnded(true)
    setCallAccepted(false)
    setIsCalling(false)
    
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localStream}
            objectFit="cover"
            zOrder={1}
          />
        )}
        
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteStream}
            objectFit="cover"
            zOrder={0}
          />
        )}
      </View>
      
      <View style={styles.controlsContainer}>
        {isCalling && !callAccepted && (
          <Text style={styles.callingText}>
            {isReceivingCall ? 'Incoming call...' : 'Calling...'}
          </Text>
        )}
        
        <TouchableOpacity
          style={styles.endCallButton}
          onPress={endCall}
        >
          <Text style={styles.endCallText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteStream: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  localStream: {
    position: 'absolute',
    width: 120,
    height: 160,
    top: 16,
    right: 16,
    borderRadius: 8,
    zIndex: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  callingText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  endCallButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default Video;