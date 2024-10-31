import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Icon, { Icons } from "@components/icons/Icons";

export default function CommonBackButton({ ...rest }) {
  const { style, color, icon } = { ...rest };
  const { theme } = useSelector((state) => state.ThemeReducer);
  let c = theme.text;
  if (color) {
    c = color;
  }
  return (
    <TouchableOpacity style={[styles.container, style]} {...rest}>
      {icon != null ? (
        icon
      ) : (
        <Icon type={Icons.Feather} size={18} name={"chevron-left"} color={c} />
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
});
