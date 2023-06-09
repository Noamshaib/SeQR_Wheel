import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPage from './RegisterPage';
import SignInPage from './SignInPage';
import ProfilePage from './ProfilePage';
import BottomTabNavigator from './BottomTabNavigator';
import QRCodeResultScreen from './QRCodeResultScreen';
import AddBike from './AddBike';
 


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
           options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="btmNav"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRCodeResult"
          component={QRCodeResultScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Addbike"
          component={AddBike}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome to My App</Text> */}
      <Image
         source={require('./logo.jpg')}
         style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 500,
    height: 160,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});
