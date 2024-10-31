import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CardScreen from "@screens/card/CardScreen";
import CardDetailScreen from "@screens/card/CardDetailScreen";
import MyCardDetailScreen from "@screens/card/MyCardDetailScreen";
const Stack = createStackNavigator();
const CardStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CardScreen"
        component={CardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CardDetailScreen"
        component={CardDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyCardDetailScreen"
        component={MyCardDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CardStackNavigator;
