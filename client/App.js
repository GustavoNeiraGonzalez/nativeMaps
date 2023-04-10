import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PrincipalStack from "./components/Stacks/PrincipalStack";
import SomosStack from "./components/Stacks/SomosStack";
import LoginStack from "./components/Stacks/LoginStack";
import CreateStack from "./components/Stacks/CreateStack";

const Tab = createBottomTabNavigator();

export default function App() {
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
           <Tab.Screen name="Crear Usuario" component={CreateStack}    options={{
headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}
          />
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}