import AsyncStorage from '@react-native-async-storage/async-storage';

const getJwt = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    console.log(token)
    return token;
  } catch (error) {
    console.log(error);
  }
};
export default getJwt;