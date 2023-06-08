import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import BottomTabNavigator from './BottomTabNavigator';
import { NGROK_URL } from './constants';
import AppContext from './AppContext';

const Tab = createBottomTabNavigator();

export default function ProfilePage() {
  // const [user, setUser] = React.useState(null);
  // const [bikeData, setBikeData] = React.useState([]);
  const context = React.useContext(AppContext)


    const user = {
      name: 'John Doe',
      image: 'data:image/jpeg;base64,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',
      email: 'email: Johnd12345@gmail.com',
      phone: 'phone number: 054-9369401' 
    };
  
    // Rest of the component code

  //
  // React.useEffect(() => {
  //   // Fetch user data from the server
  //   fetch(`${NGROK_URL}/api/user`, {
  //     body: JSON.stringify(context),
  //     method: 'POST'
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setUser(data))
  //     .catch((error) => console.error('Error fetching user data:', error));

  //   // Fetch bike data from the server
  //   fetch(`${NGROK_URL}/api/bike`, {
  //     body: JSON.stringify(context),
  //     method: 'POST'
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setBikeData(data))
  //     .catch((error) => console.error('Error fetching bike data:', error));
  // }, []);
  const bikeData = [
    {
      serial_num: '1',
      image: require('./assets/bicycle.jpg'),
      name: 'Mountain Bike',
      details: 'Lorem ipsum dolor sit amet',
    },
    {
      serial_num: '2',
      image: require('./assets/bicycle.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    {
      serial_num: '3',
      image: require('./assets/bicycle.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    {
      serial_num: '4',
      image: require('./assets/bicycle.jpg'),
      name: 'red Bike',
      details: 'Consectetur adipiscing elit',
    },
    // Add more bike items here
  ];

  
  const handleReportAsStolen = async (bikeId) => {
    try {
      const response = await fetch(`${NGROK_URL}/api/set_stole`, {
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
        <Text style={styles.bikeName}>{item.name}</Text>
        <Text style={styles.bikeDetails}>{item.details}</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          <Image source={ user.profilePicture } style={styles.profilePicture} />
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
