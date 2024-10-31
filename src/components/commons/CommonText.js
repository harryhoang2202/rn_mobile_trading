import { resolveFontFamilyStyle } from "@modules/core/constant/AppTextStyle";
import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";

function CommonText({ style, ...rest }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const resolvedStyle = Array.isArray(style)
    ? style.map(resolveFontFamilyStyle)
    : resolveFontFamilyStyle(style);
  const { children } = { ...rest };
  return (
    <Text
      {...rest}
      style={[{ color: theme.text, fontSize: 16 }, resolvedStyle]}
    >
      {children}
    </Text>
  );
}

export default CommonText;
