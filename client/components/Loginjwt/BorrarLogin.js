import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = async () => {
    try {
        const token = await AsyncStorage.getItem('jwt');

        await AsyncStorage.removeItem('jwt');
        if(token===null){
          return "No estabas logeado"

        }else{
          return "Borrado exitosamente"
        }
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