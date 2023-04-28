import React,{useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PrincipalStack from "./components/Stacks/PrincipalStack";
import SomosStack from "./components/Stacks/SomosStack";
import LoginStack from "./components/Stacks/LoginStack";
import CreateStack from "./components/Stacks/CreateStack";
import prueba from './components/AuthContext/prueba'
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(false); // dato para usar la funcion de filtración
  const ejemplo = async ()=>{
    let token = '';
    await prueba().then(tokenn => { // Usar .then para obtener el token
      setUser(tokenn);
    }).catch(error => {
        console.log(error)
    });
  }
  useEffect(() => {
    ejemplo()
  }, [])
  useEffect(() => {
  }, [user])
  
  return (
    <NavigationContainer >
      <Tab.Navigator screenOptions={{
    tabBarStyle: { backgroundColor: "#292929" },
  }}>
        <Tab.Screen name="Principal" component={PrincipalStack}    options={{
headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}
          />
        <Tab.Screen name="Somos" component={SomosStack}   options={{
headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}/>
              <Tab.Screen name="Login" component={LoginStack}    options={{
headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}
          />
            {user ? null : (
           <Tab.Screen name="Crear Usuario" component={CreateStack}    options={{
headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}
          />
            )}

      </Tab.Navigator>
      
    </NavigationContainer>
  );
}