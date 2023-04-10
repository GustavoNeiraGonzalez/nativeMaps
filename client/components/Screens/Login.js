import React, { useState } from 'react';
import {Button, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../LoginEstilos/Login.module';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [PasswordError, setPasswordError] = useState('');
    const [UsernameError, setUsernameError] = useState('');

    const handlePasswordChange = (text) => {
        setPassword(text);
    
        if (text.length < 5) {
            setPasswordError('La contraseña tiene al menos 5 caracteres');
        } else if (!/[A-Z]/.test(text)) {
            setPasswordError('La contraseña tiene al menos una letra mayúscula');
        } else if (!/[a-z]/.test(text)) {
            setPasswordError('La contraseña tiene al menos una letra minuscula');
        } else {
            setPasswordError('');
        }
    }
    
    const handleUsernameChange = (text) => {
        setUsername(text);

        if (text.length < 4) {
            setUsernameError('El nombre de usuario tiene al menos 4 caracteres');
        }
        else if (!/^[a-zA-Z0-9]+$/.test(text)) {
            setUsernameError('El nombre de usuario tiene contener letras y números');
        }else{
            setUsernameError('')
        }
    }

    const createUser = () => {    
        // Validar nombre de usuario
        if (username.length < 4) {
            alert('El nombre de usuario debe tener al menos 4 caracteres');
            return;
        }
        else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            alert('El nombre de usuario solo puede contener letras y números');
            return;
        }
    
        // Validar contraseña
        if (password.length < 5) {
            alert('La contraseña debe tener al menos 5 caracteres');
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            alert('La contraseña debe tener al menos una letra mayúscula');
            return;
        }
        else if (!/[a-z]/.test(password)) {
            alert('La contraseña debe tener al menos una letra minuscula');
            return;
        }
    
        // Enviar solicitud al servidor
        axios.post('<URL>', {
            username: username,
            email: email,
            password: password
        })
        .then(response => {
            // Manejar la respuesta del servidor
        })
        .catch(error => {
            // Manejar el error
        });
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.text}>Usuario:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => handleUsernameChange(e)}
        value={username}
        placeholder="Usuario"
        placeholderTextColor="wheat"
      />
        <Text style={{color: 'red'}}>{UsernameError}</Text>

        <Text style={styles.text}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => handlePasswordChange(e)}
        value={password}
        placeholder="Contraseña"
        secureTextEntry={!showPassword}
        placeholderTextColor="wheat"
      />
        <Text style={{color: 'red'}}>{PasswordError}</Text>

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={{color: 'wheat'}}>{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</Text>
      </TouchableOpacity>
      <Button
              title="Aceptar"
              onPress={() => {
              }}
            />
    </View>
  );
}
