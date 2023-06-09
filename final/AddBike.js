import React from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

const validationSchema = Yup.object().shape({
    company: Yup.string().required('Company is required'),
    model: Yup.string(),
    serialNumber: Yup.string(),
    color: Yup.string().required('Color is required'),
    size: Yup.string(),
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
  
    return (
      <View style={styles.container}>
         <Text style={styles.title}>Add Bike</Text>
        <Formik
          initialValues={{
            company: '',
            model: '',
            serialNumber: '',
            photo: null,
            color: '',
            size: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Company"
                onChangeText={handleChange('company')}
                value={values.company}
              />
              {errors.company && <Text>{errors.company}</Text>}
  
              <TextInput
                style={styles.input}
                placeholder="Model"
                onChangeText={handleChange('model')}
                value={values.model}
              />
  
              <TextInput
                style={styles.input}
                placeholder="Serial Number"
                onChangeText={handleChange('serialNumber')}
                value={values.serialNumber}
              />
  
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
  
    