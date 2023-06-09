import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AddBike from './AddBike';


const Tab = createBottomTabNavigator();

export default function ProfilePage({ navigation }) {
  const user = {
    name: 'John Doe',
    profilePicture: require('./person.jpg'),
    email: 'email:  Johnd12345@gmail.com',
    phone: 'phone number: 054-9369401'
  };

  const bikeData = [
    {
      id: '1',
      image: require('./bike1.jpg'),
      name: 'Mountain Bike',
      details: 'Lorem ipsum dolor sit amet',
    },
    {
      id: '2',
      image: require('./bike2.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    {
      id: '3',
      image: require('./bike2.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    {
      id: '4',
      image: require('./bike2.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    // Add more bike items here
  ];

  const renderBikeItem = ({ item }) => (
    <View style={styles.bikeItem}>
      <Image source={item.image} style={styles.bikeImage} />
      <Text style={styles.bikeName}>{item.name}</Text>
      <Text style={styles.bikeDetails}>{item.details}</Text>
    </View>
  );

  const handleAddBike = () => {
    navigation.navigate('Addbike');
  };

  return (

    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          <Image source={user.profilePicture} style={styles.profilePicture} />
        </View>
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>
      </View>
      <FlatList
        data={bikeData}
        renderItem={renderBikeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bikeListContainer}
      />


      <TouchableOpacity style={styles.circleButton} onPress={handleAddBike}>
        <MaterialIcons name="pedal-bike" size={32} color="white" />
      </TouchableOpacity>

      
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 25
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profilePictureContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  userDetailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  bikeListContainer: {
    padding: 16,
    justifyContent: "center",
  },
  bikeItem: {
    marginBottom: 16,
    justifyContent: "center",
  },
  bikeImage: {
    width: 200,
    height: 150,
    marginBottom: 8,
    borderRadius: 8,
    marginLeft:60
  
  },
  bikeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bikeDetails: {
    fontSize: 14,
    color: '#888',
  },
  circleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3BD323',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
