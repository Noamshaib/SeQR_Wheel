import React from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { NGROK_URL } from './constants';

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  serial_num: Yup.string(),
  owner: Yup.string().required('Owner is required'),
  color: Yup.string().required('Color is required'),
  size: Yup.string(),
  contact_info: Yup.string().required('Contact info is required'),
});

export default function AddBike() {
  const handleChoosePhoto = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFieldValue('photo', result.uri);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${NGROK_URL}/create_vehicle`, values); // Replace 'YOUR_SERVER_URL' with the actual URL of your server
      console.log(response.data); // Handle the response from the server
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Bike</Text>
      <Formik
        initialValues={{
          type: '',
          serial_num: '',
          owner: '',
          photo: null,
          color: '',
          size: '',
          contact_info: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Type"
              onChangeText={handleChange('type')}
              value={values.type}
            />
            {errors.type && <Text>{errors.type}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Serial Number"
              onChangeText={handleChange('serial_num')}
              value={values.serial_num}
            />

            <TextInput
              style={styles.input}
              placeholder="Owner"
              onChangeText={handleChange('owner')}
              value={values.owner}
            />
            {errors.owner && <Text>{errors.owner}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Color"
              onChangeText={handleChange('color')}
              value={values.color}
            />
            {errors.color && <Text>{errors.color}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Size"
              onChangeText={handleChange('size')}
              value={values.size}
            />

            <TextInput
              style={styles.input}
              placeholder="Contact Info"
              onChangeText={handleChange('contact_info')}
              value={values.contact_info}
            />
            {errors.contact_info && <Text>{errors.contact_info}</Text>}

            <View style={styles.photoContainer}>
              {values.photo && <Image source={{ uri: values.photo }} style={styles.photo} />}
            </View>
            <View style={styles.btn}>
              <Button title="Choose Photo" onPress={() => handleChoosePhoto(setFieldValue)} />
            </View>
            <Button title="Submit" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoContainer: {
      width: '100%',
      height: 200,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      overflow: 'hidden',
    },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
  btn: {
      marginBottom: 20,
  }
});
