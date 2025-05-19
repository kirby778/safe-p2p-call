/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Clipboard, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../lib/utils/store';
import socket from '../lib/sockets/videoSocket.js';

const Home = () => {
  const [targetUserId, setTargetUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const userId = useStore(state => state.userId);
  
  useEffect(() => {
    // Connect to socket when component mounts
    if (socket) {
      // Check if the socket is already connected
      if (socket.connected) {
        setIsConnected(true);
      } else {
        // Connect to the video-calling-io namespace
        socket.connect();
      }
      
      // Set up socket event listeners
      socket.on('connected', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
      });
      
      socket.on('invalid-contact-id', ({ data }) => {
        Alert.alert('Invalid User', `The user ID ${data.userId} does not exist.`);
      });
      
      socket.on('offline-contact', ({ data }) => {
        Alert.alert('User Offline', `The user ${data.userId} is currently offline.`);
      });
      
      socket.on('call-now', ({ data }) => {
        if (data && data.userId && data.signal) {
          // Navigate to the Video screen for the incoming call
          navigation.navigate('Video', { 
            callerId: data.userId,
            signal: data.signal,
            isReceivingCall: true
          });
        }
      });
    }
    
    return () => {
      // Clean up socket listeners when component unmounts
      if (socket) {
        socket.off('connected');
        socket.off('invalid-contact-id');
        socket.off('offline-contact');
        socket.off('call-now');
      }
    };
  }, [navigation]);
  
  const copyToClipboard = () => {
    Clipboard.setString(userId);
    Alert.alert('Copied', 'Your ID has been copied to clipboard.');
  };
  
  const onCallUser = (userIdToCall) => {
    if (!userIdToCall || userIdToCall.trim() === '') {
      Alert.alert('Error', 'Please enter a valid user ID');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Not Connected', 'You are not connected to the server. Please try again.');
      return;
    }
    
    // Navigate to the Video screen with the target user ID
    navigation.navigate('Video', {
      targetUserId: userIdToCall,
      isReceivingCall: false
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CodeCaller</Text>
      
      <View style={styles.connectionStatus}>
        <Text>Connection Status: </Text>
        <Text style={isConnected ? styles.connected : styles.disconnected}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      <Text style={styles.label}>Your ID:</Text>
      <View style={styles.idBox}>
        <Text style={styles.userId}>{userId}</Text>
        <Button title="Copy" onPress={copyToClipboard} />
      </View>

      <Text style={styles.label}>Call a User</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID to call"
        value={targetUserId}
        onChangeText={setTargetUserId}
      />
      <TouchableOpacity 
        style={styles.callButton} 
        onPress={() => onCallUser(targetUserId)}
      >
        <Text style={styles.callButtonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  connected: {
    color: 'green',
    fontWeight: 'bold',
  },
  disconnected: {
    color: 'red',
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  userId: {
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home