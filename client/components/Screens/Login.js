import React, { useEffect, useState } from 'react';
import {Button, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../LoginEstilos/Login.module';
import PostLogin from '../Loginjwt/login'
import Logout from '../Loginjwt/BorrarLogin'
import { Alert } from 'react-native';
import getJwt from '../Loginjwt/getJwt'
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [PasswordError, setPasswordError] = useState('');
    const [UsernameError, setUsernameError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // nuevo estado para saber si el usuario está logeado
    const [user, setUser] = useState(); // dato para usar la funcion de filtración
    const ejemplo = async ()=>{
      await getJwt().then(tokenn => { // Usar .then para obtener el token
        setUser(tokenn);
        if (tokenn===null){
            setIsLoggedIn(false)
        }else{
            setIsLoggedIn(true)
        }
    }).catch(error => {
          console.log(error)
      });
    }
    useEffect(() => {
        ejemplo()
    }, [])
    
    useEffect(() => {
      }, [user]);
    
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

    const Login = () => {    
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
    
       // Llamada a la función PostLogin
        PostLogin(username, password)
        .then(response => {
            setPassword('')
            setUsername('')
            setIsLoggedIn(true);
            // Si la respuesta es satisfactoria, muestra una alerta de éxito
            Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
        })
        .catch(error => {
        // Si la respuesta es un error, muestra una alerta de error con la descripción del error
        console.log(error)
        Alert.alert('Error', error.message);
        });
    }

    return (
        <View style={styles.container}>
          { isLoggedIn===true ? (
            <>
              <Text style={styles.title}>Ya has iniciado sesión</Text>
              <Button
                title="Cerrar sesión"
                onPress={() => {
                  Logout().then((response) => {
                    setIsLoggedIn(false);
                    Alert.alert('Alerta', response);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
                }}
              />
            </>
          ) : (
            <>
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
                  Login();
                }}
              />
            </>
          )}
        </View>
      );
}
