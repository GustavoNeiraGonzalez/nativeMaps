import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
        />
      </View>
      <Text>XD</Text>
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

