import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  function handlePress(asd, asd2)  {
      setUserLocation({asd,asd2})
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
    {console.log(location.coords.latitude)}
    {console.log(location.coords.longitude)}

  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <View style={styles.containermap}>
        <MapView
          style={styles.map}
          region={{
            latitude: location ? location.coords.latitude : -33.4489,
            longitude: location ? location.coords.longitude : -70.6693,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onPress={async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
              requestLocationPermissions();
            }
          }}
          showsUserLocation={true}
        >

          <Circle
            center={{latitude:-33.5817928,longitude:-70.6448737}}
            radius={100}
            strokeWidth={2}
            strokeColor="red"
            fillColor="green"
          />
        </MapView>
      </View>
      <Button title="Marcar ubicación" onPress={()=>{
        handlePress(location.coords.latitude,location.coords.longitude)
        console.log(userLocation)
        console.log(location.coords.latitude)
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
  },
  containermap: {
    width: 200,
    height: 200,
    borderRadius: 91,
    overflow: 'hidden',
  },
});

