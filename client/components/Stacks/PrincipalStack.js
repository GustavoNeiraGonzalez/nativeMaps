import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from '../Screens/Principal'
import Somos from "../Screens/Somos";

const Stack = createNativeStackNavigator();

const PrincipalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Principall" component={Principal}   options={{ headerShown: false , headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}/>
      <Stack.Screen name="Somoss" component={Somos}   options={{ headerShown: false ,  headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" }, }}/>
    </Stack.Navigator>
  );
};

export default PrincipalStack;
