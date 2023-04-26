import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = async () => {
    try {
        await AsyncStorage.removeItem('jwt');
        // Aquí puedes agregar cualquier otra lógica que quieras ejecutar al hacer logout
    } catch (error) {
        console.log(error);
    }    
};
export default Logout;