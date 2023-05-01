import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

axios.defaults.baseURL = 'http://192.168.18.69:8000'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

  const PostLogin = async (username,password) => {
    try {
      const response = await axios.post('/api/token/', {
          username: username,
          password: password
      });
      const token = 'Bearer '+response.data.access;
      await AsyncStorage.setItem('jwt', token);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Error de autenticación
          throw new Error('Las credenciales proporcionadas no son correctas o la cuenta no está activa.');
        } else {
          // Otro tipo de error
          throw new Error(error.response.data.detail);
        }
      } else {
        throw new Error(error.message);
      }
      }
  }

export default PostLogin;
