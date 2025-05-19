/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { API_BASEURL } from '../lib/config/env';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../lib/utils/authStore';

export default function Join() {
  const [email, setEmail] = useState('');
  const isEditable = useRef(true)
  const nav = useNavigation();
  let store = useAuthStore();
  const handleJoin = async () => {
    isEditable.current = false;
    try {
      function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
      }
      if (!isValidEmail(email)) {
        return Alert.alert('Failed To Join', 'Please check Email is valid or not ');
      }
      let response = await fetch(API_BASEURL + '/api/auth/init?' + new URLSearchParams({ email }).toString(), { method: "POST" });

      if (response.status === 200) {
        store.setEmail(email);
        nav.navigate('OtpVerification');
      } else {
        return Alert.alert('Server Error', 'Unknown Server Error');
      }

    } catch (error) {
      console.error(error);
      
      Alert.alert('Failed To Join', 'Please check Email is valid or not ');
    } finally {
      isEditable.current = true;
    }
  };

  return (
  
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1,   justifyContent: 'center',padding: 20 }}
      >
          <Text>Enter your email to join:</Text>
        <TextInput
          placeholder="email@example.com"
          value={email}
          editable={isEditable.current}
          onChangeText={setEmail}
          style={{
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 20,
            padding: 10,
            borderRadius: 5,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
         <Button title="Join" onPress={handleJoin} />
      </KeyboardAvoidingView>
     
    
  );
}
