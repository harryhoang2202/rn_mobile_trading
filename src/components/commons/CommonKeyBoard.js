import { Icons } from "@components/icons/Icons";

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import CommonText from "./CommonText";

const CommonKeyBoard = ({
  onPressKeyBtn,
  onPressAllBtn,
  onPressConfirmBtn,
}) => {
  const [pin, setPin] = useState("");
  const { theme } = useSelector((state) => state.ThemeReducer);

  const handlePinPress = (value) => {
    const newPin = pin + value;
    setPin(newPin);
    onPressKeyBtn(newPin);
  };

  const handleDeletePress = () => {
    if (pin.length > 0) {
      const newPin = pin.slice(0, -1);
      setPin(newPin);
      onPressKeyBtn(newPin);
    }
  };

  const keyboardData = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [".", 0, "DEL"],
  ];

  const renderKeyboard = () => {
    return keyboardData.map((row, rowIndex) => (
      <View style={styles.row} key={rowIndex}>
        {row.map((item, columnIndex) => (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.container }]}
            onPress={() => {
              if (item == "DEL") {
                handleDeletePress();
              } else if (item == "." && !pin.includes(".")) {
                handlePinPress(item);
              } else {
                handlePinPress(item);
              }
            }}
            disabled={item == "DEL" && pin.length <= 0}
            key={columnIndex}
          >
            <CommonText style={styles.buttonText}>{item}</CommonText>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.keyboardContainer}>
        <View>{renderKeyboard()}</View>
        <View>
          <TouchableOpacity
            onPress={() => {
              onPressAllBtn();
            }}
          >
            <LinearGradient
              colors={theme.gradient4}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CommonText style={{ color: theme.text2, fontSize: 30 }}>
                All
              </CommonText>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressConfirmBtn();
            }}
            style={{ flex: 1, marginBottom: 5 }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={theme.gradient5}
              style={{
                width: 85,
                height: "100%",
                borderRadius: 6,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.AntDesign name={"check"} color={theme.icon1} size={35} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  keyboardContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: 85,
    height: 45,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginRight: 5,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default CommonKeyBoard;
