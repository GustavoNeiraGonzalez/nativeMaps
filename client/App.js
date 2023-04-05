import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {Circle,Marker,Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = Array.from({length: currentYear - 2000 + 1}, (v, i) => 2000 + i);
  const months = [
    {name: 'Enero', value: 0},
    {name: 'Febrero', value: 1},
    {name: 'Marzo', value: 2},
    {name: 'Abril', value: 3},
    {name: 'Mayo', value: 4},
    {name: 'Junio', value: 5},
    {name: 'Julio', value: 6},
    {name: 'Agosto', value: 7},
    {name: 'Septiembre', value: 8},
    {name: 'Octubre', value: 9},
    {name: 'Noviembre', value: 10},
    {name: 'Diciembre', value: 11}
  ];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  const getAvailableMonths = () => {
    if (selectedYear === currentYear) {
      return months.filter(month => month.value <= currentMonth);
    } else {
      return months;
    }
  }


  const example = [
    { "latitude": -33.59522924065171, "longitude": -70.67142482846975, "fecha": "13:45 02/01 2023", "delito": "asalto" },
    { "latitude": -33.604710911424135, "longitude": -70.6145080178976, "fecha": "14:00 03/02 2023", "delito": "hurto" },
    { "latitude": -33.57073091478793, "longitude": -70.60186006128788, "fecha": "15:15 04/01 2023", "delito": "asalto" },
    { "latitude": -33.580926151345786, "longitude": -70.64625162631273, "fecha": "16:30 05/02 2023", "delito": "hurto"},
    { "latitude": -33.580926151345786, "longitude": -70.64625162631273, "fecha": "16:30 05/02 2023", "delito": "hurto"},

    { "latitude": -33.580926151345786, "longitude": -70.64625162631273, "fecha": "16:30 05/02 2023", "delito": "hurto"},

    { "latitude": -33.58116050080819, "longitude": -70.64616646617651, "fecha": "17:45 06/03 2023", "delito": "asalto"},
    { "latitude": -33.58359725059294, "longitude": -70.64564276486635, "fecha": "14:00 03/03 2023", "delito": "hurto" }
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
  const groupCoordinates = (coordinates, maxDistance, userLocation,
                           filterDistance, filterDelito, filterDate) => {
    const groups = [];
    for (let i = 0; i < coordinates.length; i++) {
       // Convertir la fecha de la coordenada a un objeto Date
       const coordDate = new Date(coordinates[i].fecha.split(' ')[2] + '-' 
       + coordinates[i].fecha.split(' ')[1].split('/')[1] + '-' + 
       coordinates[i].fecha.split(' ')[1].split('/')[0] + 'T' + 
       coordinates[i].fecha.split(' ')[0] + ':00Z');
      // Obtener la fecha límite, si no hay fecha limite entonces es la fecha actual menos 1 año
      const dateLimit = filterDate ? filterDate : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      // Verificar si la fecha de la coordenada es posterior a la fecha límite

      
      if (coordDate < dateLimit) continue;
        // Calcular la distancia entre la coordenada y la ubicación del usuario
      const start = {
        latitude: coordinates[i].latitude,
        longitude: coordinates[i].longitude,
      };
      const end = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      const distanceInMeters = haversine(start, end, {unit: 'meter'});
      
      // aqui se verifica si hay un filtro de delito y entonces verifica si el delito coincide, si no coincide
      // se ejecuta el continue, que en resumen hará que como no coincide ya no ejecute mas el codigo de este 
      // ciclo y pase al siguiente ciclo
      if (filterDelito && coordinates[i].delito !== filterDelito) continue;
      
      // operador ternario para filtrar si hay filterdistancec y si no, usar maxdistance que seria el por defecto
      if (filterDistance ? distanceInMeters <= filterDistance : distanceInMeters <= maxDistance) {
        let grouped = false;
        // Buscar un grupo existente para agregar la coordenada
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
            // Verificar si la distancia entre la coordenada y el grupo es menor o igual a 28 metros
            if (distanceInMeters <= 28) {
              // Agregar la coordenada al grupo
              groups[j].push(coordinates[i]);
              grouped = true;
              break;
            }
          }
          if (grouped) break;
        }
        // Si no se encontró un grupo existente para agregar la coordenada, crear un nuevo grupo
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
const dateLimit = new Date();
dateLimit.setFullYear(2023); // Establecer el año en 2023
dateLimit.setMonth(2); // Marzo es el mes 2 (Enero es 0)
dateLimit.setDate(3); // Establecer el día en 2 para obtener el segundo día del mes
dateLimit.setHours(0); // Establecer la hora en 0 para obtener la primera hora del día
dateLimit.setMinutes(0); // Establecer los minutos en 0
dateLimit.setSeconds(0); // Establecer los segundos en 0
dateLimit.setMilliseconds(0); // Establecer los milisegundos en 0
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
        {groupCoordinates(example, 2000, location.coords, null, null, dateLimit).map((circle, index) => (
          <React.Fragment key={index}>
            <Circle
              center={{ latitude: circle.latitude, longitude: circle.longitude }}
              radius={circle.radio}
              strokeWidth={2}
              strokeColor="red"
              fillColor="rgba(0,128,0,0.5)" />
          <Marker coordinate={{latitude: circle.latitude, longitude: circle.longitude}}>
            <Callout>
                <View style={styles.callout}>
                    <Text style={styles.title}>{circle.fusion ? `Cantidad: ${circle.fusion}`  : 'Cantidad: 1'}</Text>
                    <Text style={styles.description}>{circle.fusion ? `${formatDatesAndCrimes(circle.fecha, circle.delito)}`
                    :  `fecha: ${circle.fecha}\n Delitos: ${circle.delito}`}</Text>
                  </View>
              </Callout>
          </Marker>
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
      <View style={styles.selectorView}>
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Año:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedYear}
            onValueChange={(itemValue) => {
              setSelectedYear(itemValue)}}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Mes:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => {
              setSelectedMonth(itemValue)}}
          >
            {getAvailableMonths().map((month) => (
              <Picker.Item key={month.value} label={month.name} value={month.value} />
            ))}
          </Picker>
        </View>

        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Hora:</Text>
            <Picker style={styles.selectorPick}
              selectedValue={selectedYear}
              onValueChange={(itemValue) => {
                setSelectedYear(itemValue)}}
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
        </View>
       
      </View>
      <View style={styles.selectorButton}>
        <Button title="Filtrar" onPress={() => {}} />
      </View>
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
  callout: {
    padding: 5,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    textAlign: 'center',
  },
  selectortext:{
    color: 'wheat',
  },
  selectorPick:{
    height: 50, 
    width: 150,
    color:'wheat'
  },
  selectorView:{
    maxWidth: '90%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  selectorButton:{
    alignItems: 'center'
  },
  selectorColumn:{
    flexDirection: 'column',
    alignItems:'center'
  }
});

