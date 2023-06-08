import React from 'react';
import { useContext } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPage from './RegisterPage';
import VehicleSearch from './VehicleSearch';
import BottomTabNavigator from './BottomTabNavigator';
import SignInPage from './SignInPage';
import AppContext from './AppContext';

const Stack = createStackNavigator();

export default function App() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <AppContext.Provider value={{username, password, setUsername, setPassword}} >
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login"
            component={SignInPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Search"
            component={VehicleSearch}
            options={{headerShown: false}}>
          </Stack.Screen>
          {/* <Stack.Screen
            name="Home"
            component={HomePage}
            options={{ headerShown: false }}
          /> */}

        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
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
        <Button title="Sign In" onPress={() => console.log('Sign In button pressed')} />
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
