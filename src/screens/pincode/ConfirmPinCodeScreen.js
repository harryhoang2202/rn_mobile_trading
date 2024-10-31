import React from "react";
import { PinCode } from "@components/PinCode";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, View } from "react-native";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";

const ConfirmPinCodeScreen = ({ navigation }) => {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <CommonTouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon type={Icons.Feather} name={"arrow-left"} />
          </CommonTouchableOpacity>
          <CommonText>{t("settings.confirm_your_pincode")}</CommonText>
          <View style={{ width: 30 }} />
        </View>
        <PinCode
          onSuccess={() => {
            navigation.navigate("ChangePinCodeScreen");
          }}
          stylePinCodeColorTitle={theme.pincodeTitle}
          stylePinCodeColorButtonNumber={theme.keyboardNumber}
          colorCircleButtons={theme.keyboardContainer}
          status={"enter"}
        />
      </LinearGradient>
    </View>
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
  gradient: {
    width: "100%",
    height: "110%",
  },
});
export default ConfirmPinCodeScreen;
