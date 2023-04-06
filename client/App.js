import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import MapView, {Circle,Marker,Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function App() {
  const [isFiltered, setIsFiltered] = useState(false); // dato para usar la funcion de filtración

  const crimes = ['---','Asalto', 'Hurto'];
  const [selectedCrime, setSelectedCrime] = useState(crimes[0]);
  const [filterDistance, setFilterDistance] = useState('');
  const handleFilterDistanceChange = (text) => {
    if (text.length <= 6 && /^\d*$/.test(text)) {
      setFilterDistance(text);
    }
}

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
  const hours = Array.from({length: 24}, (v, i) => i);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedYearShow, setselectedYearShow] = useState(currentYear);//esto para dar información al cliente
  const [selectedMonthShow, setselectedMonthShow] = useState(currentMonth);//esto para dar información al cliente
  const [selectedYearFunction, setselectedYearFunction] = useState(null);//esto para hacer la funcion de filtro
  const [selectedMonthFunction, setselectedMonthFunction] = useState(null);//esto para hacer la funcion de filtro

  const getAvailableMonths = () => {
    if (selectedYearShow === currentYear) {
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
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

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
  
  const formatDatesAndCrimes = (dates, crimes) => {
    let result = '';
    for (let i = 0; i < dates.length; i++) {
        result += `Fecha: ${dates[i]} - Delito: ${crimes[i]}\n`;
    }
    return result;
   
  }
  const GetDateUser = (selectedYearFunction, selectedMonthFunction, selectedHour) =>{
    if (selectedYearFunction || selectedMonthFunction || selectedHour){
    const dateLimit = new Date();
    dateLimit.setFullYear(selectedYearFunction ? selectedYearFunction : currentYear); // Establecer el año 
    dateLimit.setMonth(selectedMonthFunction ? selectedMonthFunction : 0); // Marzo es el mes 2 (Enero es 0)
    dateLimit.setDate(1); // Establecer el día 1 
    dateLimit.setHours(selectedHour ? selectedHour : 0); // Establecer la hora 
    dateLimit.setMinutes(0); // Establecer los minutos
    dateLimit.setSeconds(0); // Establecer los segundos 
    dateLimit.setMilliseconds(0); // Establecer los milisegundos 
    return dateLimit;
    }else{
      //con el if verificamos que la funcion tiene parametros, y si no los tiene 
      //retornará null para usar la funcion mas adelante sin usar operadores ternarios 
      return null
    }
  }

  const getFilteredCoordsData = () =>{
    return  groupCoordinates(example, 2000, location.coords,
      filterDistance ? filterDistance : null,//filtrar distancia
      selectedCrime !== '---' ? selectedCrime : null,//filtrar crimen
      //filtrar fecha por año o mes o hora
      GetDateUser(selectedYearFunction ?selectedYearFunction : null, 
         selectedMonthFunction ? selectedMonthFunction : null, 
         selectedHour ? selectedHour : null)
         )
  }

  return (
    <View style={styles.container}>
      <View style={styles.containermap}>
      {location ? (
        
        /*aqui se crea la base del mapa */
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
            }
          }}
          showsUserLocation={true}
        >
          {/*Aqui se muestra las marcas en el mapa pero verifica si isfiltered es true o false, si es
          false se usa unos filtros por defecto */}
          {(isFiltered ? getFilteredCoordsData() : groupCoordinates(example, 2000, location.coords)).map(
  (circle, index) => (

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
        /*ERROR DE CARGA DE MAPA */
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorContainer}>{errorMsg}</Text>
        </View>
      ) : (
        /*LO QUE SE MUESTRA MIENTRAS  CARGA MAPA  */
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingContainer}>Cargando ubicación...</Text>
        </View>
      )}
      </View>
      {/*MARCADOR DE UBICACIÓN */}

      {location &&(
      <Button title="Marcar ubicación" onPress={()=>{
        handlePress(location.coords.latitude,location.coords.longitude)
      }
        } label="xd"/>
        )}
        <StatusBar style="auto" />
      {/*SELECTOR DE AÑO */}

      <View style={styles.selectorView}>
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Año:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedYearShow}
            onValueChange={(itemValue) => {
              setselectedYearShow(itemValue)
              setselectedYearFunction(itemValue)
            }}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        {/*SELECTOR DE MES */}

        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Mes:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedMonthShow}
            onValueChange={(itemValue) => {
              setselectedMonthShow(itemValue);
              setselectedMonthFunction(itemValue);
            }}
          >
            {getAvailableMonths().map((month) => (
              <Picker.Item key={month.value} label={month.name} value={month.value} />
            ))}
          </Picker>
        </View>
        {/*SELECTOR DE HORA */}
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Hora:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedHour}
            onValueChange={(itemValue) => {
              setSelectedHour(itemValue)}}
          >
            {hours.map((hour) => (
              <Picker.Item key={hour} label={`${hour.toString().padStart(2, '0')}:00`} value={hour} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.selectorView}>
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Elegir Delito:</Text>
          <Picker style={styles.selectorPick}
            selectedValue={selectedCrime}
            onValueChange={(itemValue) => {
              setSelectedCrime(itemValue)}}
          >
            {crimes.map((crime) => (
              <Picker.Item key={crime} label={crime} value={crime} />
            ))}
          </Picker>
        </View>
        <View styles={styles.selectorColumn}>
          <Text style={styles.selectortext}>Distancia (en metros):</Text>
          <TextInput
            style={styles.selectorTextInput}
            value={filterDistance}
            onChangeText={handleFilterDistanceChange}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.selectorButton}>
      <Button title="Filter" onPress={() => setIsFiltered(true)} />
      </View>
      <View style={styles.selectorButton}>
      <Button title="Desfiltrar" onPress={() => setIsFiltered(false)} />
      </View>
      <Text style={styles.selectortext}>{isFiltered ? "Filtrado Encendido" : "Filtrado Apagado"} </Text>
    </View>
  );
};
console.log

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
  },
  selectorTextInput:{
    backgroundColor:'#9999',
    borderRadius:10,
    color: 'wheat',
  }
});

