/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { View, Text, StyleSheet } from 'react-native';

const ErrorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>An error occurred. App has stopped.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ErrorScreen;
