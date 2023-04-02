import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {Circle,Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  let timerId;

  const example = [
    { "latitude": -33.57151952569935, "longitude": -70.66198445856571 },
    { "latitude": -33.59522924065171, "longitude": -70.67142482846975 },
    { "latitude": -33.604710911424135, "longitude": -70.6145080178976 },
    { "latitude": -33.57073091478793, "longitude": -70.60186006128788 },
   
    {"latitude": -33.580926151345786, "longitude": -70.64625162631273},
    {"latitude": -33.58116050080819, "longitude": -70.64616646617651}
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
      return result;
    });
  }
   

  
  if (location && location.coords) {
    const groupedCoordinates = groupCoordinates(example, 2000, location.coords);
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
         { groupCoordinates(example, 2000, location.coords).map((circle, index) => (
  <React.Fragment key={index}>
       <Circle
             center={{ latitude: circle.latitude, longitude: circle.longitude }}
             radius={circle.radio}
             strokeWidth={2}
             strokeColor="red"
             fillColor="rgba(0,128,0,0.5)" />
            <Marker coordinate={{latitude: circle.latitude, longitude: circle.longitude}} 
            title={circle.fusion ? `Fusión: ${circle.fusion}` : 'Fusión: 1'} />
             
             </React.Fragment>))}
          
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
    width: 250,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

