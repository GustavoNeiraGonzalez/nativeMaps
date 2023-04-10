import React, { useState } from 'react';
import {Button, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../LoginEstilos/Create.module'
import axios from 'axios';
export default function Create() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    const [UsernameError, setUsernameError] = useState('');

    const handleEmailChange = (text) => {
        setEmail(text);
    
        if (!text) {
            setEmailError('Escribir un correo válido');
        } else if (!/\S+@\S+\.\S+/.test(text)) {
            setEmailError('Escribir un correo válido');
        } else {
            setEmailError('');
        }
    }
    const handlePasswordChange = (text) => {
        // Validar nombre de usuario
        setPassword(text);

        if (text.length < 5) {
            setPasswordError('La contraseña debe tener al menos 5 caracteres');
        }
        else if (!/[A-Z]/.test(text)) {
            setPasswordError('La contraseña debe tener al menos una letra mayúscula');
        }
        else if (!/[a-z]/.test(text)) {
            setPasswordError('La contraseña debe tener al menos una letra minuscula');
        }
    }
    const handleUsernameChange = (text) => {
        setUsername(text);

        if (text.length < 4) {
            setUsernameError('El nombre de usuario debe tener al menos 4 caracteres');
        }
        else if (!/^[a-zA-Z0-9]+$/.test(text)) {
            setUsernameError('El nombre de usuario solo puede contener letras y números');
        }
    }

    const createUser = () => {
        // Validar correo electrónico
        if (!email) {
            alert('El correo electrónico no puede estar vacío');
            return;
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            alert('El formato del correo electrónico es inválido');
            return;
        }
    
        // Validar nombre de usuario
        else if (username.length < 4) {
            alert('El nombre de usuario debe tener al menos 4 caracteres');
            return;
        }
        else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            alert('El nombre de usuario solo puede contener letras y números');
            return;
        }
    
        // Validar contraseña
        else if (password.length < 5) {
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
            setPassword('');
            setUsername('');
            setEmail('');
            // Manejar la respuesta del servidor
        })
        .catch(error => {
            // Manejar el error
        });
    }
    


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear usuario</Text>
      <Text style={{color: 'wheat'}}>Usuario</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => {
            handleUsernameChange(e)
        }}
        value={username}
        placeholder="example"
        placeholderTextColor="wheat"
      />      
      <Text style={{color: 'red'}}>{UsernameError}</Text>
      <Text style={{color: 'wheat'}}>Correo</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => {
            handleEmailChange(e)
        }}
        value={email}
        placeholder="example@example.com"
        placeholderTextColor="wheat"
      />
      <Text style={{color: 'red'}}>{emailError}</Text>
      <Text style={{color: 'wheat'}}>Contraseña</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => {
            handlePasswordChange(e)
        }}
        value={password}
        placeholder="*****"
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
                createUser()
              }}
            />    
        </View>
  );
}
