import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import Wallet from "@components/icons/menu/Wallet";
import Setting from "@components/icons/menu/Setting";
import Swap from "@components/icons/menu/Swap";
import React, { useRef } from "react";
import Dapp from "@components/icons/menu/Dapp";
import Card from "@components/icons/menu/Card";
import Blog from "@components/icons/menu/Blog";
import LinearGradient from "react-native-linear-gradient";
import ActionSheet from "react-native-actions-sheet";

import SettingAlert from "@screens/setting/SettingScreen";
import Market from "@components/icons/menu/Market";
import CommonText from "@components/commons/CommonText";
import { fonts } from "@modules/core/constant/AppTextStyle";

function CustomBottomTabBar({ state, descriptors, navigation }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const actionSheetRef = useRef();
  const renderIconTabBar = () => {
    return state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;
      const tabBarLabel = options.tabBarLabel;
      const isFocused = state.index === index;
      console.log(tabBarLabel);
      const onPress = () => {
        if (tabBarLabel === "Setting") {
          SettingAlert.show({
            onNavigation: (name) => {
              navigation.navigate(name);
            },
          });
        } else {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({
              name: route.name,
              merge: true,
            });
          }
        }
      };

      const onLongPress = () => {
        if (tabBarLabel === "Setting") {
          SettingAlert.show({
            onNavigation: (name) => {
              navigation.navigate(name);
            },
          });
        } else {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        }
      };

      if (tabBarLabel === "Card" || tabBarLabel === "Market") {
        return (
          <View
            style={{
              width: Dimensions.get("screen").width / 4,
              height: 130,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 50,

                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.icon}>
                    {tabBarLabel === "Card" && (
                      <Card
                        color={
                          isFocused
                            ? theme.bottomBarIconActive
                            : theme.bottomBarIconInactive
                        }
                      />
                    )}
                    {tabBarLabel === "Market" && (
                      <Market
                        color={
                          isFocused
                            ? theme.bottomBarIconActive
                            : theme.bottomBarIconInactive
                        }
                      />
                    )}
                  </View>
                  <CommonText
                    style={{
                      color: isFocused ? theme.text : theme.text4,

                      fontSize: 11,
                      fontFamily: fonts.ProximaNova,
                    }}
                  >
                    {label}
                  </CommonText>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: 1,
                  height: tabBarLabel === "Card" ? 18 : 40,
                  marginTop: tabBarLabel === "Card" ? 10 : 0,
                  borderRightWidth: 2,
                  borderRightColor: "#BEC7C5",
                }}
              />
            </View>
          </View>
        );
      }
      if (tabBarLabel === "Swap" || tabBarLabel === "Dapps") {
        return (
          <View
            style={{
              width: Dimensions.get("screen").width / 4 - 20,
              height: 130,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 50,

                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.icon}>
                    {tabBarLabel === "Swap" && (
                      <Swap
                        color={
                          isFocused
                            ? theme.bottomBarIconActive
                            : theme.bottomBarIconInactive
                        }
                      />
                    )}
                    {tabBarLabel === "Dapps" && (
                      <Dapp
                        color={
                          isFocused
                            ? theme.bottomBarIconActive
                            : theme.bottomBarIconInactive
                        }
                      />
                    )}
                  </View>
                  <CommonText
                    style={{
                      color: isFocused ? theme.text : theme.text4,
                      fontFamily: fonts.ProximaNova,
                      fontSize: 11,
                    }}
                  >
                    {label}
                  </CommonText>
                </View>
              </TouchableOpacity>
              {tabBarLabel === "Swap" && (
                <View
                  style={{
                    width: 1,
                    height: 40,
                    borderRightWidth: 2,
                    borderRightColor: "#BEC7C5",
                  }}
                />
              )}
            </View>
          </View>
        );
      }

      if (tabBarLabel === "Wallet") {
        return (
          <View
            style={{
              position: "absolute",
              width: "100%",
              top: -5,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={theme.buttonGradient}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 64,
                  height: 64,
                  borderRadius: 35,
                  borderColor: theme.border3,
                  borderWidth: 5,
                }}
              >
                <View style={styles.icon}>
                  <Wallet />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      }

      if (tabBarLabel === "Setting") {
        return (
          <View
            style={{
              position: "absolute",
              bottom: 15,
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={theme.gradient1}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderColor: theme.border3,
                  borderWidth: 2,
                }}
              >
                <View style={styles.icon}>
                  <Setting size={16} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      }
    });
  };
  return (
    <View
      style={{
        position: "absolute",
        height: 130,
        bottom: 10,
        left: 20,
        right: 20,
        elevation: 0,
      }}
    >
      <View
        style={{
          height: "100%",

          justifyContent: "center",
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={theme.bottomBarGradient}
          style={{
            height: 80,
            borderRadius: 20,
          }}
        ></LinearGradient>
      </View>
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          flexDirection: "row",
        }}
      >
        {renderIconTabBar()}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContainer: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    position: "absolute",
    right: 100,
  },
});
export default CustomBottomTabBar;
