import axios from "axios";

axios.defaults.baseURL = 'https://zapatobello.pythonanywhere.com'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // Establece el encabezado CORS para permitir todas las solicitudes

const obtenerUbicaciones = async () => {
  try {
    const response = await axios.get('/api/createUbi/');
    return response.data;
  } catch (error) {
    if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
}

export default obtenerUbicaciones;
