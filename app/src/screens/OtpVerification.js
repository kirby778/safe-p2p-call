// screens/OtpScreen.tsx
import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../lib/utils/authStore';
import { API_BASEURL } from '../lib/config/env';
import useStore from '../lib/utils/store';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

export default function OtpVerification({ }) {
  const [otp, setOtp] = useState('');
  const isEditable = useRef(true)
  let store = useAuthStore();
  let setToken = useStore(state => state.setBearerToken);
  const nav = useNavigation()
  const handleVerify = async () => {
    isEditable.current = false;
    try {
      let response = await fetch(API_BASEURL + "/api/auth/verify", {
        headers: {
          'content-type': "application/json",
        },
        method: "post",
        body: JSON.stringify({
          otp : Number(otp),
          email: store.email
        })
      });
      if (response.status === 200) {
        let { token } = await response.json();
        setToken(token);
        await SecureStore.setItemAsync('bearerToken', token,);
        nav.navigate('Home')
      } else {
        console.log((await response.json()));
        
        throw new Error("Server Responded with " + response.status);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Action Failed', "Failed to Verify Otp")
    } finally {
      isEditable.current = true;
    }
  };

  return (


    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: 'center', padding: 20 }}
    >
      <Text>Enter the 6-digit OTP sent to your email:</Text>
      <TextInput
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        style={{
          fontSize: 24,
          letterSpacing: 10,
          textAlign: 'center',
          borderWidth: 1,
          padding: 10,
          marginVertical: 20,
          borderRadius: 5,
        }}
        editable={isEditable.current}
      />
      <Button title="Verify OTP" onPress={handleVerify} />
    </KeyboardAvoidingView>

  );
}
