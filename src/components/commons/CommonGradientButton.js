import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useSelector } from "react-redux";

export default function CommonGradientButton({ disabled, ...props }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  return (
    <TouchableOpacity
      {...props}
      onPress={() => (props.onPress || !disabled ? props.onPress() : null)}
      style={[styles.buttonContainer, props.style]}
    >
      <ImageBackground
        source={
          disabled
            ? require("@assets/images/button/disabled-button.png")
            : require("@assets/images/button/button.png")
        }
        style={styles.buttonBg}
      >
        <CommonText
          style={[
            styles.text,
            { color: props.disabled ? "gray" : theme.text2 },
            props.textStyle,
          ]}
        >
          {props.text}
        </CommonText>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 299,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
