import React, { useEffect } from "react";
import { PinCode } from "@components/PinCode";
import { BackHandler, SafeAreaView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonBackButton from "@components/commons/CommonBackButton";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import CommonAppBar from "@components/commons/CommonAppBar";

const ReEnterPinCodeScreen = ({ route }) => {
  const params = route.params;
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const success = async () => {
    navigation.goBack();
    if (params) {
      params.onCallBack();
    }
  };

  return (
    <LinearGradient
      colors={theme.gradient}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>{params && <CommonAppBar title="" />}</View>
        <PinCode
          onSuccess={() => success()}
          status={"enter"}
          stylePinCodeColorTitle={theme.pincodeTitle}
          stylePinCodeColorButtonNumber={theme.keyboardNumber}
          colorCircleButtons={theme.keyboardContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
export default ReEnterPinCodeScreen;
