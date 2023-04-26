import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const Logout = async () => {
    try {
        await AsyncStorage.removeItem('jwt');
        // Aquí puedes agregar cualquier otra lógica que quieras ejecutar al hacer logout
    } catch (error) {
        if (error.response) {
            Alert.alert('error', error.response.data);
          } else {
            Alert.alert('error', error.message);
          }
        }
};
export default Logout;