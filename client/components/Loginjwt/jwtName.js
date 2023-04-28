import AsyncStorage from '@react-native-async-storage/async-storage';

const getJwt = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    console.log(token)
    return token;
  } catch (error) {
    if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
};
export default getJwt;