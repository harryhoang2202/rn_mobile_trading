import { StyleSheet } from "react-native";

export const defaultFontFamily = "Roboto";
export const defaultFontWeight = "400";

export const fonts = {
  Roboto: "Roboto",
  ProximaNova: "ProximaNova",
  Nunito: "Nunito",
};

export const fontWeightMappings = {
  "": "Regular",
  bold: "Bold",
  300: "Light",
  400: "Regular",
  500: "Medium",
  700: "Bold",
};
export const resolveFontFamilyStyle = (style) => {
  const resolvedStyle = StyleSheet.flatten(style);
  const {
    fontFamily = defaultFontFamily,
    fontWeight = defaultFontWeight,
    ...otherStyles
  } = resolvedStyle || {
    fontFamily: defaultFontFamily,
    fontWeight: defaultFontWeight,
  };

  if (fontWeight in fontWeightMappings) {
    const resolvedFontWeight = fontWeightMappings[fontWeight];
    const correctFont = `${fontFamily}-${resolvedFontWeight}`;
    return {
      ...otherStyles,
      fontFamily: correctFont,
      fontWeight: fontWeight,
    };
  }

  return style;
};
