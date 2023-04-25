import AsyncStorage from '@react-native-async-storage/async-storage';

export const getJwt = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    return token;
  } catch (error) {
    console.log(error);
  }
};
