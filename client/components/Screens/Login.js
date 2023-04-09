import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../LoginEstilos/Login.module';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.text}>Usuario:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Usuario"
        placeholderTextColor="wheat"
      />
     
        <Text style={styles.text}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Contraseña"
        secureTextEntry={!showPassword}
        placeholderTextColor="wheat"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={{color: 'wheat'}}>{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}
