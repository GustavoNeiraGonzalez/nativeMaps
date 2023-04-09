import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from "../Screens/Principal";
import Somos from "../Screens/Somos";
import Login from '../Screens/Login'

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
      
    <Stack.Navigator>
      <Stack.Screen name="Loginn" component={Login}   options={{ headerShown: false , headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" },}}/>
      <Stack.Screen name="Somoss" component={Somos}   options={{ headerShown: false , headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" },}}/>
      <Stack.Screen name="Principall" component={Principal}   options={{ headerShown: false , headerTitleStyle: { color: "wheat" },
    headerStyle: { backgroundColor: "#292929" },}}/>
    </Stack.Navigator>
    
  );
};

export default LoginStack;
