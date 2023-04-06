import * as Location from 'expo-location';

  async function requestLocationPermissions(setErrorMsg, setLocation) {
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
  }

export default requestLocationPermissions;
