import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NGROK_URL } from './constants'; 
import AppContext from './AppContext';

export default function SignInPage({ navigation }) {
  const initialValues = {
    username: '',
    password: '',
  };

  const context = React.useContext(AppContext)

  const validationSchema = Yup.object().shape({
    //username: Yup.string().username('Invalid username').required('username is required'),
    password: Yup.string().required('Password is required'),
  })
  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${NGROK_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        // Server response was successful
        const data = await response.json();
        console.log('Sign in successful:', data);
        navigation.navigate('BottomTabNavigator');
        console.log(values)
        context.setUsername(values.username)
        context.setPassword(values.password)
        // context.setUsername(data.username)
        // Do something with the server response, e.g., store the user token or navigate to the next screen
      } else {
        // Server response was not successful
        const errorData = await response.json();
        console.log('Sign in error:', errorData);
        // Handle the error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.form}>

            <TextInput
              style={styles.input}
              placeholder="username"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Button title="Sign in" onPress={handleSubmit} />
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
