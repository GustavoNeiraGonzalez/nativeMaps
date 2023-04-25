import axios from "axios";
import getJwt from "../Loginjwt/getJwt";
import { useState } from "react";
axios.defaults.baseURL = 'http://192.168.18.69:8000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const PostUbicaciones = async (crimen, newDate, latitude, longitude) => {
    let token = '';
    await getJwt().then(tokenn => { // Usar .then para obtener el token
      token = tokenn;
    }).catch(error => {
      console.log(error);
    });

    const tokenHeader = {headers:{ Authorization: token }};
    try {
        const response = await axios.post('/api/createUbi/', {
        crimen: crimen,
        date: newDate,
        latitude: latitude,
        longitude: longitude
        }, tokenHeader);
        console.log('bueno')
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(newDate)
            console.log(error.response.data);
          } else {
            console.log('malo2')
            console.log(error.message);
          }
    }
}

export default PostUbicaciones