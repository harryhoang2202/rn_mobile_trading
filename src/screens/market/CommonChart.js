import { StyleSheet, View } from "react-native";
import React from "react";
import * as shape from "d3-shape";
import { Defs } from "react-native-svg";
import { LinearGradient } from "react-native-svg";
import { Stop } from "react-native-svg";
import { AreaChart } from "react-native-svg-charts";

const CommonChart = ({
  data,
  height = 240,
  width = "100%",
  fillColor = "#E577FF",
  strokeColor = "#E577FF",
  contentInset = {
    top: 0,
    bottom: 0,
  },
}) => {
  const GradientChart = () => (
    <Defs key="gradient">
      <LinearGradient
        id="gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0%" stopColor={fillColor} stopOpacity={0.75} />
        <Stop offset="100%" stopColor={"#6B2474"} stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: height,
        width: width,
      }}
    >
      <AreaChart
        style={{ flex: 1 }}
        data={data}
        curve={shape.curveLinear}
        svg={{
          stroke: strokeColor,
          strokeWidth: 2,
          fill: "url(#gradient)",
        }}
        contentInset={contentInset}
      >
        <GradientChart />
      </AreaChart>
    </View>
  );
};

export default CommonChart;

const styles = StyleSheet.create({});
