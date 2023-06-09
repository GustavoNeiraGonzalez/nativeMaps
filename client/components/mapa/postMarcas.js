import axios from "axios";
import getJwt from "../Loginjwt/getJwt";

axios.defaults.baseURL = 'https://zapatobello.pythonanywhere.com'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const PostUbicaciones = async (crimen,comentario, newDate, latitude, longitude) => {
    let token = '';
    await getJwt().then(tokenn => { // Usar .then para obtener el token
      token = tokenn;
    }).catch(error => {
        console.log(error)
    });

    const tokenHeader = {headers:{ Authorization: token }};
    try {
        const response = await axios.post('/api/createUbi/', {
        crimen: crimen,
        date: newDate,
        latitude: latitude,
        longitude: longitude,
        comentario:comentario
        }, tokenHeader);
        return response.data;
    } catch (error) {
        console.log(error.response.data)
        if (error.response) {
          if (error.response.data.detail ==="Authentication credentials were not provided."){
            throw new Error("Se necesita iniciar Sesión para hacer esta acción");
          }else{
            if (error.response.data.detail) {
              throw new Error(error.response.data.detail);

            }else{
            throw new Error(error.response.data);
            }
          }
          } else {
            console.log(error.message)
            console.log("message")
            throw new Error(error.message);
          }
    }
}

export default PostUbicaciones