import axios from "axios";
axios.defaults.baseURL = 'http://192.168.18.69:8000'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // Establece el encabezado CORS para permitir todas las solicitudes

const obtenerUbicaciones = async () => {
  try {
    const response = await axios.get('/api/createUbi/');
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default obtenerUbicaciones;
