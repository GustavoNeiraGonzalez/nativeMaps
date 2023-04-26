import React, { useEffect, useMemo, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import styles from '../mapa/estilos'
import { StatusBar } from 'expo-status-bar';
import { Switch,Modal,Text, View, Button, TextInput } from 'react-native';
import MapView, {Circle,Marker,Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import requestLocationPermissions from '../mapa/PermisosUbi'
import months from '../mapa/months'
import GetDateUser from '../mapa/GetDateUser'
import obtenerUbicaciones from '../mapa/ubicaciones'
import PostUbicaciones from '../mapa/postMarcas'
import getJwt from '../Loginjwt/getJwt'
import obtenerCrimenes from '../mapa/crimenes'
export default function Principal() {
  
  const [isFiltered, setIsFiltered] = useState(false); // dato para usar la funcion de filtración
  const [modalVisible, setModalVisible] = useState(false);
  const [useCurrentDate, setUseCurrentDate] = useState(false);
  const [useCurrentLocationBtn, setUseCurrentLocationBtn] = useState(false);
  const [useCurrentLocationBtnvalue, setUseCurrentLocationBtnvalue] = useState(false);

  const [crimes,setCrimes] = useState([])
  const [selectedCrime, setSelectedCrime] = useState('---');
  const [selectedCrimeBtn, setSelectedCrimeBtn] = useState('---');
  const currenttHour = new Date().getHours();
  const currenttminute = new Date().getMinutes();
  const [selectedHourBtn, setSelectedHourBtn] = useState(currenttHour);
  const [selectedMinuteBtn, setSelectedMinuteBtn] = useState(currenttminute);

  const [filterDistance, setFilterDistance] = useState('');
  const handleFilterDistanceChange = (text) => {
    if (text.length <= 6 && /^\d*$/.test(text)) {
      setFilterDistance(text);
    }
}
   



  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentMonthpost = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const currentDay = new Date().getDate().toString().padStart(2, '0');
  const years = Array.from({length: currentYear - 2000 + 1}, (v, i) => 2000 + i);
  const hours = Array.from({length: 24}, (v, i) => i);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedYearShow, setselectedYearShow] = useState(currentYear);//esto para dar información al cliente
  const [selectedMonthShow, setselectedMonthShow] = useState(currentMonth);//esto para dar información al cliente
  const [selectedYearFunction, setselectedYearFunction] = useState(null);//esto para hacer la funcion de filtro
  const [selectedMonthFunction, setselectedMonthFunction] = useState(null);//esto para hacer la funcion de filtro

  // Genera una lista de horas válidas
  const getAvailableHours = () => {
    const currentHour = new Date().getHours();
    const hoursBtn = []
    for (let i = 0; i <= currentHour; i++) {
        hoursBtn.push(i.toString().padStart(2, '0'));
    }
    return hoursBtn;
  };

  // Genera una lista de minutos válidos
  
  const getAvailableMinutes = (selectedHourBtn) => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const minutesBtn = [];
    for (let i = 0; i < 60; i++) {
      if (selectedHourBtn ? Number(selectedHourBtn) === currentHour && i > currentMinute : i > currentMinute ) {
        break;
      }
      minutesBtn.push(i.toString().padStart(2, '0'));
    }
    return minutesBtn;
  };  
 

  const getAvailableMonths = () => {
    if (selectedYearShow === currentYear) {
      return months.filter(month => month.value <= currentMonth);
    } else {
      return months;
    }
  }
  

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [Circles, setCircles] = useState([]);
  const [MarkPositionBtn, setMarkPositionBtn] = useState(null);
  const [ubicacionesDjango, setUbicacionesDjango] = useState([]);

  function handlePress(latitude, longitude)  {
      setUserLocation({latitude,longitude})
  };
  useEffect(() => {
    requestLocationPermissions(setErrorMsg, setLocation);
    
  }, []);
  useEffect(()=>{
    obtenerUbicaciones()
      .then(data =>{setUbicacionesDjango(data)
      })
      .catch(error => {
        console.error(error);
      });
  },[])
  useEffect(()=>{
    console.log("llamando a funcion crimenes")
    obtenerCrimenes()
      .then(response=>{
        console.log("Respuesta de la API recibida correctamente:", response);
        setCrimes(response)
        setSelectedCrime(response[0]);
        setSelectedCrimeBtn(response[0]);
      }).catch((error) =>{
        console.log(error)
      })
  },[])

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
        const coordDate = new Date(coordinates[i].date.split(' ')[2] + '-' 
        + coordinates[i].date.split(' ')[1].split('/')[1] + '-' + 
        coordinates[i].date.split(' ')[1].split('/')[0] + 'T' + 
        coordinates[i].date.split(' ')[0] + ':00Z');
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
        result.date = [];
        result.crimen = [];
        group.forEach(coord => {
            result.date.push(coord.date);
            result.crimen.push(coord.crimen);
        });
        return result;
      });
    }
  //aqui le doy un formato a los datos de dates y crimes para mostrarlas al cliente
  const formatDatesAndCrimes = (dates, crimes) => {
    let result = '';
    for (let i = 0; i < dates.length; i++) {
        result += `Fecha: ${dates[i]} - Delito: ${crimes[i]}\n`;
    }
    return result;
  }

  const getFilteredCoordsData = () =>{
    return  groupCoordinates(ubicacionesDjango, 2000, location.coords,
      filterDistance ? filterDistance : null,//filtrar distancia
      selectedCrime !== '---' ? selectedCrime : null,//filtrar crimen
      //filtrar fecha por año o mes o hora
      GetDateUser(selectedYearFunction ?selectedYearFunction : null, 
         selectedMonthFunction ? selectedMonthFunction : null, 
         selectedHour ? selectedHour : null,
         currentYear)
         )
  };
  
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

            const { latitude, longitude } = event.nativeEvent.coordinate;
            // Actualiza el estado con las coordenadas del evento de toque
            setMarkPositionBtn({"latitude":latitude,"longitude":longitude})
              
          }}
          showsUserLocation={true}
        >
            {/* Agrega un marcador en la posición especificada en el estado */}
            {MarkPositionBtn && (
                <Marker coordinate={{latitude:MarkPositionBtn.latitude,longitude:MarkPositionBtn.longitude}}  pinColor={'#00FF00'} />
            )}
          {/*Aqui se muestra las marcas en el mapa pero verifica si isfiltered es true o false, si es
          false se usa unos filtros por defecto */}
          {(isFiltered ? getFilteredCoordsData() : groupCoordinates(ubicacionesDjango, 2000, location.coords)).map(
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
                    <Text style={styles.description}>{circle.fusion ? `${formatDatesAndCrimes(circle.date, circle.crimen)}`
                    :  `fecha: ${circle.date}\n Delitos: ${circle.crimen}`}</Text>
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
        setModalVisible(true)
          }
        } label="xd"/>
        )}
        {/*-------------------- */}

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Selecciona un delito:</Text>

            <Picker
            selectedValue={selectedCrimeBtn } style={styles.selectorPick}
            onValueChange={(itemValue) => {setSelectedCrimeBtn(itemValue)}}>
            {crimes.map((crime) => {
            console.log("Generando JSX para el crimen:", crime);
            return (
                <Picker.Item key={crime} label={crime} value={crime} />
              );
            })}
        </Picker>

          <View style={styles.modalSwitch}>
            <Text style={styles.modalText}>Usar Hora actual:</Text>
            <Switch
              value={useCurrentDate}
              onValueChange={(value) => {
                setUseCurrentDate(value);
                setSelectedHourBtn(currenttHour)
                setSelectedMinuteBtn(currenttminute)
              }}
            />
          </View>
          <View style={styles.modalSwitch}>
            <Text style={styles.modalText}>Usar ubicación actual:</Text>
            <Text style={styles.modalSubText}>(Al no seleccionar se usará la marca creada</Text>
            <Text style={styles.modalSubText}> en el mapa)</Text>
            <Switch
              value={useCurrentLocationBtn}
              onValueChange={(value) => {
                setUseCurrentLocationBtn(value)
                setUseCurrentLocationBtnvalue({ latitude: location.coords.latitude,
                  longitude: location.coords.longitude});
              }}
            />
          </View>
          {!useCurrentDate &&(

            <View>
                <Text style={styles.selectortext}>hora</Text>
                <Picker
                    selectedValue={selectedHourBtn } style={styles.selectorPick}
                    onValueChange={(itemValue) => {setSelectedHourBtn(itemValue)}}>
                    {getAvailableHours().map((hour) => (
                    <Picker.Item key={hour} label={hour} value={hour} />
                    ))}
                </Picker>
                <Text style={styles.selectortext}>Minuto</Text>

                <Picker selectedValue={selectedMinuteBtn } style={styles.selectorPick}
                    onValueChange={(itemValue) => {setSelectedMinuteBtn(itemValue)}}>
                    {getAvailableMinutes(selectedHourBtn).map((minute) => (
                    <Picker.Item key={minute} label={minute} value={minute} />
                    ))}
                </Picker>
            </View>
            )}
          <View style={styles.modalButtons}>
            <Button
              title="Aceptar"
              onPress={() => {
                newDate = `${selectedHourBtn.toString().padStart(2, '0')}:${selectedMinuteBtn.toString().padStart(2, '0')} ${currentDay}/${currentMonthpost} ${currentYear}`
                //HAY QUE CONVERTIR LA HORA MINUTO Y FECHA A UN FORMATO hh:mm dd/mm AAAA
                if(useCurrentLocationBtn === true){
                  PostUbicaciones(selectedCrimeBtn, newDate,
                     useCurrentLocationBtnvalue.latitude,useCurrentLocationBtnvalue.longitude
                     )
                  //aqui codigo usando localización actual del usuario
                }else{
                  PostUbicaciones(selectedCrimeBtn, newDate,
                    MarkPositionBtn.latitude,MarkPositionBtn.longitude
                    )
                  //aqui usando MarkPositionBtn que es la posicion puesta en el marcador
                  //verificar si es null para indicar que debe poner un marcador en el mapa
                }
                setModalVisible(false);
              }}
            />
            <Button
              title="Rechazar"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
        {/*-------------------------*/}
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
            {crimes.map((crime) => {
              console.log("Generando JSX para el crimen:", crime);
              return (
                  <Picker.Item key={crime} label={crime} value={crime} />
                );
            })}
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
      <Text style={styles.selectortext}>Por defecto 2000 metros </Text>

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

