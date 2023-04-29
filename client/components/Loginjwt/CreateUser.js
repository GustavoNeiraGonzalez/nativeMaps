import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'https://zapatobello.pythonanywhere.com'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const CreateUserr = async (username,email,password) => {
  try {
    const response = await axios.post('/api/createUser', {
        username: username,
        password: password,
        email:email
    });
    const token = 'Bearer '+response.data.access;
    await AsyncStorage.setItem('jwt', token);
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage = 'Ha ocurrido un error desconocido se recomienda Verificar el formato de correo';
    let errorDetails = null;
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || 'Ha ocurrido un error desconocido se recomienda Verificar el formato de correo';
      errorDetails = error.response.data.details || null;
    }
    throw new Error(errorMessage, errorDetails);
  }
}

export default CreateUserr;
