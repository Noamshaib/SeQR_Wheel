import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, Switch } from 'react-native';
import { NGROK_URL } from './constants';

export default function VehicleSearch() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [colorFilter, setColorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  const handleSearch = () => {
    // Replace with your actual API URL
  
    // Construct the search query parameters based on the search criteria
    const queryParams = [];
    if (searchText) {
      queryParams.push(`q=${encodeURIComponent(searchText)}`);
    }
    if (advancedSearch) {
      if (colorFilter) {
        queryParams.push(`color=${encodeURIComponent(colorFilter)}`);
      }
      if (typeFilter) {
        queryParams.push(`type=${encodeURIComponent(typeFilter)}`);
      }
      if (companyFilter) {
        queryParams.push(`type=${encodeURIComponent(companyFilter)}`);
      }
    }
  
    // Combine the query parameters into a single string
    const queryString = queryParams.join('&');
  
    // Make the API request
    fetch(`${NGROK_URL}?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data); // Assuming the API response is an array of search results
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        // Handle the error, e.g., display an error message to the user
      });
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Image source={item.image} style={styles.bikeImage} />
      <View style={styles.bikeDetails}>
        <Text style={styles.bikeName}>{item.name}</Text>
        <Text>{`Company: ${item.company}`}</Text>
        <Text>{`Color: ${item.color}`}</Text>
        <Text>{`Type: ${item.type}`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search bicycles..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.advancedOptions}>
        <Text>Advanced Options:</Text>
        <Switch value={advancedSearch} onValueChange={setAdvancedSearch} />
      </View>

      {advancedSearch && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Color"
            value={colorFilter}
            onChangeText={setColorFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Type"
            value={typeFilter}
            onChangeText={setTypeFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Company"
            value={typeFilter}
            onChangeText={setCompanyFilter}
          />
        </View>
      )}

      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  advancedOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bikeImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  bikeDetails: {
    flex: 1,
  },
  bikeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
