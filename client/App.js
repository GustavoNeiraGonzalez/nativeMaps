import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PrincipalStack from "./components/Stacks/PrincipalStack";
import SomosStack from "./components/Stacks/SomosStack";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Principal" component={PrincipalStack} />
        <Tab.Screen name="Somos" component={SomosStack} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}