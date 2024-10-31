import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import HomeScreen from "@screens/home/HomeScreen";
import SwapScreen from "@screens/swap/SwapScreen";
import CardScreen from "@screens/card/CardScreen";
import { useNavigation } from "@react-navigation/native";
import BlogScreen from "@screens/blog/BlogScreen";
import DAppsScreen from "@screens/dapps/DAppsScreen";
import CustomBottomTabBar from "./CustomBottomTabBar";
import MarketScreen from "@screens/market/MarketScreen";
import CardStackNavigator from "./CardStackNavigator";

const Tab = createBottomTabNavigator();

function BottomTabBarNavigator() {
  const { appLock } = useSelector((state) => state.AppLockReducer);
  let timeOut = appLock.autoLock;
  let lock = appLock.appLock;
  let inBackground = false;
  let lastDate = Date.now();
  const navigation = useNavigation();
  const lockState = (nextAppState) => {
    console.log(
      "Next AppState is: ",
      nextAppState + " inBackground " + inBackground
    );

    if (nextAppState === "active" && inBackground) {
      const timeDiff = Date.now() - lastDate;
      if (timeDiff > timeOut * 1000) {
        if (lock === true) {
          navigation.navigate("ReEnterPinCodeScreen");
        }
      }
      inBackground = false;
      lastDate = Date.now();
    } else if (nextAppState === "background") {
      inBackground = true;
      lastDate = Date.now();
    }
  };

  const handleAppStateChange = (nextAppState) => {
    lockState(nextAppState);
  };
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      appStateListener.remove();
    };
  }, [timeOut, lock]);

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      tabBarPosition={"bottom"}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {
        <Tab.Screen
          name="SwapScreen"
          component={SwapScreen}
          options={{
            tabBarLabel: "Swap",
          }}
        />
      }
      <Tab.Screen
        name="CardStackNavigator"
        component={CardStackNavigator}
        options={{
          tabBarLabel: "Card",
        }}
      />

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Wallet",
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Setting",
        }}
      />

      <Tab.Screen
        name="MarketScreen"
        component={MarketScreen}
        options={{
          tabBarLabel: "Market",
        }}
      />
      <Tab.Screen
        name="DAppsScreen"
        component={DAppsScreen}
        options={{
          tabBarLabel: "Dapps",
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabBarNavigator;
