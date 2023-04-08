import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Somos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre el proyecto</Text>
      <Text style={styles.text}>Aplicación desarrollada para informar a las personas sobre posibles zonas de delitos.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'wheat',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: 'wheat',
    textAlign: 'center',
  },
});

export default Somos;
