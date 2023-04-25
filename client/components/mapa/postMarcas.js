import axios from "axios";

axios.defaults.baseURL = 'http://192.168.18.69:8000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const PostUbicaciones = async (crimen, date, latitude, longitude) => {
  try {
    const response = await axios.post('/api/createUbi/', {
      crimen: crimen,
      date: date,
      latitude: latitude,
      longitude: longitude
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default PostUbicaciones;
