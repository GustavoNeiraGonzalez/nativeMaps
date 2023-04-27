import AsyncStorage from '@react-native-async-storage/async-storage';

const prueba = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    return token;
  } catch (error) {
    if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
    
};
export default prueba;