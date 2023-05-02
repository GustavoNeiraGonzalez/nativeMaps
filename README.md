# nativeMaps
# ProyectoPeliculasReact
Proyecto para aprender react
# que se necesita para iniciar la app? 
- *npm install no se usaria porque estariamos generando una app para celulares pero en caso de no tenerlo entonces usarlo
- instalar dependencias de django con pip install -r requirements.txt  tambien puede dar 
error por no tener instalado python-dateutil, entonces instalarlo: pip install python-dateutil
- abrir el servidor de manera local
python manage.py runserver 192.168.18.69:8000
donde 192.168.18.69 representa la ip para compartir desde tu computadora (con emulador dentro del pc ya la ip puede ser por defecto de python)
- Iniciar el cliente con npx expo start, luego usar el codigo qr o ingresar la ip
# caracteristicas
- Uso de mapa de google maps
- Creacion y login de usuarios
- Generación y visualizacion de marcas en el mapa con su respectiva información
- Filtrado por distancia (con respecto al usuario) y/o año, mes , hora y/o Delito 
- Multiples verificaciones tanto del servidor como del cliente como: Ingresar datos en un formato valido,
  no ingresar caracteres vacios, Haber iniciado sesión para ingresar marcas
- actualización del mapa cuando ingresas una marca dentro del mismo
- marcar el mapa usando ubicacion actual o poner un puntero como ubicacion
# Dependencias
# Dependencias de React-Native-Expo
-    "@react-native-async-storage/async-storage": "1.17.11",
-    "@react-native-picker/picker": "2.4.8",
-    "@react-navigation/bottom-tabs": "^6.5.7",
-    "@react-navigation/native": "^6.1.6",
-    "@react-navigation/native-stack": "^6.9.12",
-    "axios": "^1.3.5",
-    "expo": "~48.0.9",
-    "expo-location": "~15.1.1",
-    "expo-status-bar": "~1.4.4",
-    "haversine": "^1.1.1",
-    "react": "^18.2.0",
-    "react-native": "0.71.7",
-    "react-native-maps": "1.3.2",
-    "react-native-safe-area-context": "4.5.0",
-    "react-native-screens": "~3.20.0"
# Requerimientos de django/python 
-    asgiref==3.6.0
-    Django==4.1.7
-    django-cors-headers==3.14.0
-    djangorestframework==3.14.0
-    djangorestframework-simplejwt==5.2.2
-    PyJWT==2.6.0
-    pytz==2023.3
-    sqlparse==0.4.3
-    tzdata==2023.3
- adicional:
- python-dateutil

# imagenes
