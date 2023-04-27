import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from '../Screens/Principal'
import Somos from "../Screens/Somos";
import Login from '../Screens/Login'
import Create from '../Screens/Create'

const Stack = createNativeStackNavigator();

const PrincipalStack = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Principall"
        component={Principal}
        options={{
          headerShown: false,
          headerTitleStyle: { color: "wheat" },
          headerStyle: { backgroundColor: "#292929" },
        }}
      />
      <Stack.Screen
        name="Somoss"
        component={Somos}
        options={{
          headerShown: false,
          headerTitleStyle: { color: "wheat" },
          headerStyle: { backgroundColor: "#292929" },
        }}
      />
        <Stack.Screen
          name="Createe"
          component={Create}
          options={{
            headerShown: false,
            headerTitleStyle: { color: "wheat" },
            headerStyle: { backgroundColor: "#292929" },
          }}
        />


      <Stack.Screen
        name="Loginn"
        component={Login}
        options={{
          headerShown: false,
          headerTitleStyle: { color: "wheat" },
          headerStyle: { backgroundColor: "#292929" },
        }}
      />
    </Stack.Navigator>
  );
};

export default PrincipalStack;
