import React from "react";
import FastImage from "react-native-fast-image";

export default function CommonImage({ source, ...rest }) {
  return (
    <FastImage
      resizeMode={"stretch"}
      source={source}
      {...rest}
      onLoad={(e) => {}}
      onError={({ nativeEvent: { error } }) => {}}
    />
  );
}
