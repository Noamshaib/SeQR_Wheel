import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NGROK_URL } from './constants';

export default function RegisterPage({ navigation }) {
  const initialValues = {
    username: '',
    full_name: '',
    email: '',
    phone_num: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required'),
    full_name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone_num: Yup.string(),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      console.log("NOOOO")
      const response = await fetch(`${NGROK_URL}/sign_up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        // Registration successful
        const data = await response.json();
        console.log('Registration successful:', data);
        navigation.navigate('BottomTabNavigator');
        // Do something with the server response, e.g., display a success message or navigate to the next screen
      } else {
        // Registration error
        const errorData = await response.json();
        console.log('Registration error:', errorData);
        // Handle the error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error registering:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="User Name"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              onChangeText={handleChange('full_name')}
              onBlur={handleBlur('full_name')}
              value={values.full_name}
            />
            {errors.full_name && <Text style={styles.error}>{errors.full_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={handleChange('phone_num')}
              onBlur={handleBlur('phone_num')}
              value={values.phone_num}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Button title="Register" onPress={handleSubmit} />
          </View>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
