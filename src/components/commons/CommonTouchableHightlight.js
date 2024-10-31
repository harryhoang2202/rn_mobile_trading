import React, { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

export default function CommonTouchableHighlight({ children, style, ...rest }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const [isPressed, setIsPressed] = useState(false);
  const { buttonGradientColor, hightlightGradientColors } = rest;

  const unPressedButtonColor = buttonGradientColor || [
    theme.container4,
    theme.container4,
  ];
  const pressedButtonColor = hightlightGradientColors || [
    theme.hightLight,
    theme.hightLight,
  ];

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <TouchableHighlight
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      {...rest}
    >
      <LinearGradient
        colors={isPressed ? pressedButtonColor : unPressedButtonColor}
        style={[{ borderRadius: 10 }, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </TouchableHighlight>
  );
}
