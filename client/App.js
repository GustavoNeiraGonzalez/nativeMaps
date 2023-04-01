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
    {"latitude": -33.58280176716889, "longitude": -70.6472809240222}
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

  const filteredExamples = example.filter((example) => {
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
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
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
          {location.coords &&(
          filteredExamples.map((example, index) => (
            <Circle
              key={index}
              center={{latitude: example.latitude, longitude: example.longitude}}
              radius={150}
              strokeWidth={2}
              strokeColor="red"
              fillColor="rgba(0,128,0,0.5)"
            />
          ))
          )}
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
        console.log(userLocation)
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

