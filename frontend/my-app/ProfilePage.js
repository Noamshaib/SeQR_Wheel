import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { Feather } from '@expo/vector-icons';
import BottomTabNavigator from './BottomTabNavigator';
import { NGROK_URL } from './constants';
import AppContext from './AppContext';

const Tab = createBottomTabNavigator();

export default function ProfilePage({ navigation }) {
  const [user, setUser] = React.useState(null);
  const [bikeData, setBikeData] = React.useState([]);
  const context = React.useContext(AppContext)


    // const user = {
    //   name: 'John Doe',
    //   email: 'email: Johnd12345@gmail.com',
    //   phone: 'phone number: 054-9369401' 
    // };
  
    // Rest of the component code

  //
  React.useEffect(() => {
    // Fetch user data from the server
    fetch(`${NGROK_URL}/get_data`, {
      body: JSON.stringify({username: context.username, password: context.password}),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user data:', error));

    // Fetch bike data from the server
    fetch(`${NGROK_URL}/get_user_vehicles`, {
      body: JSON.stringify({username: context.username, password: context.password}),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => setBikeData(data))
      .catch((error) => console.error('Error fetching bike data:', error));
  }, []);
  // const bikeData = [
  //   {
  //     serial_num: '1',
  //     image: require('./assets/bicycle.jpg'),
  //     name: 'Mountain Bike',
  //     details: 'Lorem ipsum dolor sit amet',
  //   },
  //   {
  //     serial_num: '2',
  //     image: require('./assets/bicycle.jpg'),
  //     name: 'red Bike',
  //     details: 'Consectetur adipiscing elit',
  //   },
  //   {
  //     serial_num: '3',
  //     image: require('./assets/bicycle.jpg'),
  //     name: 'red Bike',
  //     details: 'Consectetur adipiscing elit',
  //   },
  //   {
  //     serial_num: '4',
  //     image: require('./assets/bicycle.jpg'),
  //     name: 'red Bike',
  //     details: 'Consectetur adipiscing elit',
  //   },
  //   // Add more bike items here
  // ];

  
  const handleReportAsStolen = async (bikeId) => {
    console.log(bikeId)
    try {
      const response = await fetch(`${NGROK_URL}/set_stole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bikeId }),
      });

      // Handle the response from the server as needed
      if (response.ok) {
        // Stolen report submitted successfully
      } else {
        // Handle error case
        const errorData = await response.json();
        console.log(errorData)
        // Handle the error response
      }
    } catch (error) {
      // Handle network errors
      console.error('Error reporting stolen:', error);
    }
  };

  const renderBikeItem = ({ item }) => (
    <View style={styles.bikeItem}>
      <Image source={item.image} style={styles.bikeImage} />
      <View style={styles.bikeInfo}>
        <Text style={styles.bikeName}>Company: {item.company}</Text>
        <Text style={styles.bikeDetails}>Owner: {item.owner}</Text>
        <Text style={styles.bikeDetails}>Type: {item.type}</Text>
        <Text style={styles.bikeDetails}>Color: {item.color}</Text>
        <Text style={styles.bikeDetails}>Size: {item.size}</Text>
        <Text style={styles.bikeDetails}>Serial Number: {item.serial_num}</Text>
        <TouchableOpacity style={styles.reportButton} onPress={() => handleReportAsStolen(item.serial_num)}>
          <Text style={styles.reportButtonText}>Report as Stolen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  if (false) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const handleAddBike = () => {
    navigation.navigate('AddBike');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          <Image source={ user?.profilePicture || '' } style={styles.profilePicture} />
        </View>
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
        </View>
      </View>
      <FlatList
        data={bikeData}
        renderItem={renderBikeItem}
        // keyExtractor={(item) => item.}
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

  bikeItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bikeInfo: {
    flex: 1,
  },

  bikeDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  reportButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  reportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
