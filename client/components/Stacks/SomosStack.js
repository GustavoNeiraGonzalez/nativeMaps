import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from "../Screens/Principal";
import Somos from "../Screens/Somos";

const Stack = createNativeStackNavigator();

const SomosStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Somos" component={Somos}   options={{ headerShown: false }}/>
      <Stack.Screen name="Principal" component={Principal}   options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default SomosStack;
