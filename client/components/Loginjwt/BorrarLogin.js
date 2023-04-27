import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = async () => {
    try {
        await AsyncStorage.removeItem('jwt');
        // Aquí puedes agregar cualquier otra lógica que quieras ejecutar al hacer logout
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        }
};
export default Logout;