import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRCodeResultScreen({ route }) {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scanned QR Code Data:</Text>
      <Text style={styles.data}>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});