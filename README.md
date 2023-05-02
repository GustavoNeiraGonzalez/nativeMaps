# nativeMaps
# Proyecto app django Native
Proyecto Creado para ingresar información en caso de delitos, y almacenarlos en un mapa que visualizará cualquier persona en un rango x de la respectiva marca
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
- Manejo de errores encontrados en la creación
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
![Principal](https://user-images.githubusercontent.com/71986954/235568909-47007c90-e3af-44cf-8f7d-9c6e33dab2f9.jpeg)
![PrincipalComentario](https://user-images.githubusercontent.com/71986954/235568917-c6223af5-9376-44ec-bc20-7d5c3f6f228e.jpeg)
![UbicacionCreada](https://user-images.githubusercontent.com/71986954/235569015-f25d1587-f952-4c24-b261-7f1b8e573ca1.jpeg)
- Se ven datos a 100 metros respecto al usuario 
![PrincipalFiltrado](https://user-images.githubusercontent.com/71986954/235569016-9714e0a9-edb8-4321-989c-afaac77964dd.jpeg)
![crearUsuario](https://user-images.githubusercontent.com/71986954/235569060-c3a97e8f-dbd1-40ac-9a49-5f183653e47e.jpeg)
![exitoCrearUsuario](https://user-images.githubusercontent.com/71986954/235569079-73ac1e88-6f5e-40ed-9c3d-e1ed65a9a70a.jpeg)
![login](https://user-images.githubusercontent.com/71986954/235569088-fbc542e5-a37e-41a5-bea3-949f951e06ad.jpeg)
![yaSesion](https://user-images.githubusercontent.com/71986954/235569105-789094e8-2386-452c-a245-1ae4bf568ff9.jpeg)


