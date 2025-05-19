/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { API_BASEURL } from "../lib/config/env";
import * as SecureStore from 'expo-secure-store';
import useStore from "../lib/utils/store";

const Wellcome = () => {
    const nav = useNavigation();
    const setToken = useStore(state => state.setBearerToken);
    const setUserId = useStore(state => state.setUserId);
    useEffect(() => {
        (async function (params) {
            let result = await SecureStore.getItemAsync('bearerToken');
          
            if (result) {
                let response =await fetch(API_BASEURL + '/api/auth/user-id' , {
                    headers : {
                        "authorization" : `Bearer ${result}`
                    },
                    method : "POST"
                });

                switch (response.status === 200) {
                    case true :
                        setToken(result);
                        nav.navigate('Home');
                        let data =(await response.json()).data;
                        setUserId(data.user.id)
                        break;
                    default:
                        console.log((await response.json()));
                        nav.navigate('Join')
                        break;
                }
            } else {
                nav.navigate('Join')
            }  
        })()
      
    }, []);
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="green" />
            <Text style={styles.text}>Welcome to CodeCaller</Text>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
    rowGap : 30// Or your theme background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Or your brand color
  },
  loader : {
    width : 100,
    height : 100
  }
});

export default Wellcome
