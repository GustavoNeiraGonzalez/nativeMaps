import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const getJwt = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    console.log(token)
    return token;
  } catch (error) {
    if (error.response) {
        Alert.alert('error', error.response.data);
      } else {
        Alert.alert('error', error.message);
      }
    }
    
};
export default getJwt;