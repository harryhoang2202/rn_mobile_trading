import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { PinCode } from "@components/PinCode";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonImage from "@components/commons/CommonImage";
import { fonts } from "@modules/core/constant/AppTextStyle";

const SetPinCodeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  useEffect(() => {}, []);

  const success = async () => {
    const goTo = route.params.new ? "AgreementScreen" : "ImportScreen";
    navigation.navigate(goTo);
  };
  return (
    <ImageBackground
      source={require("@assets//images/walkthrough/bg2.png")}
      style={[
        styles.backgroundImage,
        { transform: [{ scaleX: 1.05 }, { scaleY: 1 }] },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <CommonImage
            source={require("@assets/images/walkthrough/logo.png")}
            style={{ width: 132, height: 36 }}
          />
          <CommonImage
            source={require("@assets/images/walkthrough/dot.png")}
            style={{ width: 32, height: 32 }}
          />
        </View>
      </View>

      <PinCode
        onFail={() => {
          console.log("Fail to auth");
        }}
        onSuccess={() => success()}
        onClickButtonLockedPage={() => console.log("Quit")}
        status={"choose"}
        stylePinCodeColorTitle={"#FFFFFF"}
        stylePinCodeColorButtonNumber={"#42353B"}
      />

      <View style={styles.securityTextContainer}>
        <CommonText style={[styles.securityText, { color: "#FFFFFF" }]}>
          {t("pincode.pass_code_will_add")}
        </CommonText>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  gradient: {
    width: "100%",
    height: "110%",
  },
  securityTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  securityText: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: fonts.ProximaNova,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  keyboardContainer: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 40,
    paddingRight: 30,
  },
});
export default SetPinCodeScreen;
