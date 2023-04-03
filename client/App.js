import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {Circle,Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function App() {

  const example = [
    { "latitude": -33.57151952569935, "longitude": -70.66198445856571, "fecha": "12:30 01/02 2023", "delito": "hurto" },
    { "latitude": -33.59522924065171, "longitude": -70.67142482846975, "fecha": "13:45 02/01 2023", "delito": "asalto" },
    { "latitude": -33.604710911424135, "longitude": -70.6145080178976, "fecha": "14:00 03/02 2023", "delito": "hurto" },
    { "latitude": -33.57073091478793, "longitude": -70.60186006128788, "fecha": "15:15 04/01 2023", "delito": "asalto" },
    {"latitude": -33.580926151345786, "longitude": -70.64625162631273, "fecha": "16:30 05/02 2023", "delito": "hurto"},
    {"latitude": -33.58116050080819, "longitude": -70.64616646617651, "fecha": "17:45 06/03 2023", "delito": "asalto"},
    {"latitude": -33.58359725059294, "longitude": -70.64564276486635, "fecha": "14:00 03/03 2023", "delito": "hurto" }
  ];
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [Circles, setCircles] = useState([]);

  function handlePress(latitude, longitude)  {
      setUserLocation({latitude,longitude})
  };
  useEffect(() => {
    requestLocationPermissions();
  }, []);
  
  async function requestLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      console.log("no ai permisos")
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 8000,
        distanceInterval: 2,
      },
      (newLocation) => {
        setLocation(newLocation);
        
      }
    );
    console.log('XD')

  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  //aqui se filtra aquellas localizaciónes que esten a menos de x metros
  const filteredExamples = example.filter((example) => {
    //al hacer el if se evita el error al no tener las coordenadas inmediatamente porque
    //obtener las coordenadas especificas toma un poco de tiempo
    if (location && location.coords) {
    
    const start = {
      latitude: example.latitude,
      longitude: example.longitude,
    };
    const end = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const distanceInMeters = haversine(start, end, {unit: 'meter'});
    //aqui se filtra la distancia en metros
    return distanceInMeters <= 2000;
  }
  });
  //aqui se calcula las coordenadas en x metros del usuario, las filtra y las junta las cercanas----------
  const groupCoordinates = (coordinates, maxDistance, userLocation) => {
    const groups = [];
    for (let i = 0; i < coordinates.length; i++) {
      const start = {
        latitude: coordinates[i].latitude,
        longitude: coordinates[i].longitude,
      };
      const end = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      const distanceInMeters = haversine(start, end, {unit: 'meter'});
      if (distanceInMeters <= maxDistance) {
        let grouped = false;
        for (let j = 0; j < groups.length; j++) {
          for (let k = 0; k < groups[j].length; k++) {
            const start = {
              latitude: coordinates[i].latitude,
              longitude: coordinates[i].longitude,
            };
            const end = {
              latitude: groups[j][k].latitude,
              longitude: groups[j][k].longitude,
            };
            const distanceInMeters = haversine(start, end, {unit: 'meter'});
            if (distanceInMeters <= 28) {
              groups[j].push(coordinates[i]);
              grouped = true;
              break;
            }
          }
          if (grouped) break;
        }
        if (!grouped) groups.push([coordinates[i]]);
      }
    }
     //aqui se modifica las coordenadas que esten cercas entre si y calcular un punto medio
    //y reemplazar ambas coordenadas para que solo quede ese punto medio

    return groups.map(group => {
      const midLatitude = group.reduce((sum, coord) => sum + coord.latitude, 0) / group.length;
      const midLongitude = group.reduce((sum, coord) => sum + coord.longitude, 0) / group.length;
      const radio = 90 + (group.length - 1) * 10;
      const result = {latitude: midLatitude, longitude: midLongitude, radio};
      if (group.length > 1) result.fusion = group.length;

       // Agregar arrays de fechas y delitos al nuevo objeto
      result.fecha = [];
      result.delito = [];
      group.forEach(coord => {
          result.fecha.push(coord.fecha);
          result.delito.push(coord.delito);
      });
      return result;
    });
  }
   

  
  if (location && location.coords) {
    const groupedCoordinates = groupCoordinates(example, 2000, location.coords);
  }
  const formatDatesAndCrimes = (dates, crimes) => {
    let result = '';
    for (let i = 0; i < dates.length; i++) {
        result += `Fecha: ${dates[i]} - Delito: ${crimes[i]}\n`;
    }
    return result;
}

  return (
    <View style={styles.container}>
      <View style={styles.containermap}>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
          }}
          onPress={async (event) => {
            event.persist();
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
              requestLocationPermissions();
            }else{
              const { latitude, longitude } = event.nativeEvent.coordinate;
              console.log({ latitude, longitude })
            }
          }}
          showsUserLocation={true}
        >
        {groupCoordinates(example, 2000, location.coords).map((circle, index) => (
          <React.Fragment key={index}>
            <Circle
              center={{ latitude: circle.latitude, longitude: circle.longitude }}
              radius={circle.radio}
              strokeWidth={2}
              strokeColor="red"
              fillColor="rgba(0,128,0,0.5)" />
          <Marker coordinate={{latitude: circle.latitude, longitude: circle.longitude}} 
            title={circle.fusion ? `Cantidad: ${circle.fusion}` : `Cantidad: 1 Fecha: ${circle.fecha}`} 
            description={circle.fusion ? `${formatDatesAndCrimes(circle.fecha, circle.delito)}`
            : `Delito: ${circle.delito[0]}`}/>
              
             
          </React.Fragment>))}
          
        </MapView>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorContainer}>{errorMsg}</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingContainer}>Cargando ubicación...</Text>
        </View>
      )}
      </View>
      {location &&(
      <Button title="Marcar ubicación" onPress={()=>{
        handlePress(location.coords.latitude,location.coords.longitude)
      }
        } label="xd"/>
        )}
        <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#292929',
    color:'wheat',
  },
  map: {
    width: '100%',
    height: '100%',
    textAlign:'center',
  },
  containermap: {
    width: 400,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  errorContainer:{
    color:'wheat',
    textAlignVertical:'center',
  },
  loadingContainer:{
    color:'wheat',
    textAlign:'center',
  },

});

