import axios from "axios";
axios.defaults.baseURL = 'http://192.168.18.69:8000'; // URL base del servidor Django
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // Establece el encabezado CORS para permitir todas las solicitudes

const obtenerCrimenes = async () => {
    console.log("Iniciando solicitud GET");

    try {
    const response = await axios.get('/api/Crimenes/get/');
    return response.data;
    } catch (error) {
        console.log('error;')
    if (error.response) {
        
        console.log(error.response.data);
    } else {
        console.log(error.message);
    }
}
}

export default obtenerCrimenes;
