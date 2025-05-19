/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/lib/config/env';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator,} from '@react-navigation/native-stack';
import Wellcome from './src/screens/Wellcome';
import { createStaticNavigation } from '@react-navigation/native';
import Join from './src/screens/Join';
import Home from './src/screens/Home';
import OtpVerification from './src/screens/OtpVerification';
import Video from './src/screens/Video';



const RootStack = createNativeStackNavigator({
  initialRouteName : 'Wellcome',
  screens :{
    Wellcome : {
      screen : Wellcome ,
      options : {
        headerShown : false
      }
    },
    Join : Join,
    Home : Home,
    Video : Video,
    OtpVerification : OtpVerification
  }
});

const Navigation = createStaticNavigation(RootStack);
export default function App() {
  return (
    <SafeAreaProvider >
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
     </SafeAreaProvider>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
   
  },
});