import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'http://192.168.18.69:8000';
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
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
  }
}

export default PostLogin;
