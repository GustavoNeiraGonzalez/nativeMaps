import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../LoginEstilos/Create.module'
export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear usuario</Text>
      <Text style={{color: 'wheat'}}>Usuario</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="example"
        placeholderTextColor="wheat"
      />
      <Text style={{color: 'wheat'}}>Correo</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="example@example.com"
        placeholderTextColor="wheat"
      />
      <Text style={{color: 'wheat'}}>Contraseña</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="*****"
        secureTextEntry={!showPassword}
        placeholderTextColor="wheat"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={{color: 'wheat'}}>{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}
