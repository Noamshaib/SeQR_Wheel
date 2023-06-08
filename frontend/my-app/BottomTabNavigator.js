import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import ProfilePage from './ProfilePage';
import VehicleSearchScreen from './VehicleSearch';
import QRScannerScreen from './QRScannerScreen';


const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        labelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="ViewProfile"
        component={ProfilePage}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={VehicleSearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ScanQR"
        component={QRScannerScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={24} color="black" />
          ),
        }}
      />
      
      
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarLabel: 'Posts',
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function ScanQRScreen() {
  return (
    <View style={styles.container}>
      <Text>Scan QR Screen</Text>
    </View>
  );
}

function ViewProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>View Profile Screen</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text>Search Screen</Text>
    </View>
  );
}

function PostsScreen() {
  return (
    <View style={styles.container}>
      <Text>Posts Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
