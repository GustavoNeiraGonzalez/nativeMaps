import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function App() {
  const example = [
    { "latitude": -33.57151952569935, "longitude": -70.66198445856571 },
    { "latitude": -33.59522924065171, "longitude": -70.67142482846975 },
    { "latitude": -33.604710911424135, "longitude": -70.6145080178976 },
    { "latitude": -33.57073091478793, "longitude": -70.60186006128788 },
    {"latitude": -33.58280176716889, "longitude": -70.6472809240222},
  ];
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  function handlePress(latitude, longitude)  {
      setUserLocation({latitude,longitude})
  };
  useEffect(() => {
    requestLocationPermissions();
  }, []);
  
//--CIRCULOS FUCIONADOS ----
// Función para calcular la distancia entre dos coordenadas usando la fórmula de Haversine
function getDistanceInMeters(coord1, coord2) {
  const R = 6371e3; // radio de la Tierra en metros
  const lat1 = coord1.latitude * (Math.PI / 180);
  const lat2 = coord2.latitude * (Math.PI / 180);
  const deltaLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
  const deltaLng = (coord2.longitude - coord1.longitude) * (Math.PI / 180);

  // Calcular el ángulo central entre las dos coordenadas
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calcular la distancia en metros
  return R * c;
}

// Función para calcular el centroide de un grupo de coordenadas
function getCentroid(coords) {
  let latitudeSum = 0;
  let longitudeSum = 0;

  // Sumar las latitudes y longitudes de todas las coordenadas del grupo
  coords.forEach(coord => {
    latitudeSum += coord.latitude;
    longitudeSum += coord.longitude;
  });

  // Calcular el promedio de las latitudes y longitudes para obtener el centroide
  return {
    latitude: latitudeSum / coords.length,
    longitude: longitudeSum / coords.length
  };
}

// Agrupar coordenadas cercanas
const groups = [];
example.forEach(coord => {
  let addedToGroup = false;
  
  // Verificar si la coordenada está cerca del centroide de algún grupo existente
  groups.forEach(group => {
    const centroid = getCentroid(group);
    if (getDistanceInMeters(coord, centroid) <= 2000) {
      group.push(coord); // Agregar la coordenada al grupo
      addedToGroup = true;
      return;
    }
  });
  
  // Si la coordenada no está cerca del centroide de ningún grupo existente,
  // crear un nuevo grupo con esa coordenada
  if (!addedToGroup) {
    groups.push([coord]);
  }
});

// Calcular el centroide y radio de cada grupo
const circles = groups.map(group => {
  const centroid = getCentroid(group); // Calcular el centroide del grupo
  
  let radius;
  if (group.length > 1) {
    radius = group.length * 80 * .75;
  } else {
    radius = 80;
  }
  
  return {...centroid, radius};
});

//--CIRCULOS FUCIONADOS ---------------------------------------------------------------------------
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
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
      }
    );

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
         {circles.map((circle, index) => (
          <Circle
            key={index}
            center={{latitude: circle.latitude, longitude: circle.longitude}}
            radius={circle.radius}
            strokeWidth={2}
            strokeColor="red"
            fillColor="rgba(0,128,0,0.5)"
          />
        ))}
          
        </MapView>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text>{errorMsg}</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Cargando ubicación...</Text>
        </View>
      )}
      </View>
      <Button title="Marcar ubicación" onPress={()=>{
        handlePress(location.coords.latitude,location.coords.longitude)
      }
        } label="xd"/>
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
    width: 200,
    height: 200,
    borderRadius: 91,
    overflow: 'hidden',
  },
});

