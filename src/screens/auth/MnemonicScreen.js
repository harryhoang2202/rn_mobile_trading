import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import LinearGradient from "react-native-linear-gradient";
import CommonImage from "@components/commons/CommonImage";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function MnemonicScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const [mnemonics] = useState(WalletFactory.generateMnemonics());
  useEffect(() => {}, []);
  const renderMnemonic = (mnemonic, index) => (
    <View key={index.toString()}>
      <LinearGradient
        colors={["#4D1691", "#4D1691", "#36096F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mnemonic}
      >
        <CommonText
          style={{
            textAlign: "left",
            fontWeight: "bold",
            color: theme.text,
            fontFamily: fonts.ProximaNova,
          }}
        >
          {index + 1}. {mnemonic}
        </CommonText>
      </LinearGradient>
    </View>
  );
  return (
    <View style={styles.container}>
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
        <View height={40} />
        <View style={{ flex: 1 }}>
          <View style={[styles.content]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText, { color: theme.text }]}>
                {t("backup.yourRecoveryPhrase")}
              </CommonText>
              <CommonText style={[styles.descText, { color: "#FFFFFF" }]}>
                {t("backup.writeDown")}
              </CommonText>
            </View>
            <View style={styles.mnemonicContainer}>
              {mnemonics && mnemonics.map(renderMnemonic)}
            </View>
            <View style={styles.warning}>
              <View style={styles.warningContainer}>
                <CommonText style={[styles.warningText, { color: theme.text }]}>
                  {t("mnemonic.do_not")}
                </CommonText>
                <CommonText
                  style={[
                    styles.warningText,
                    {
                      color: theme.text,
                      fontWeight: "normal",
                      marginTop: 10,
                    },
                  ]}
                >
                  {t("backup.never_ask")}
                </CommonText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CommonGradientButton
            text={t("continue")}
            style={{
              marginVertical: 10,
            }}
            textStyle={{ color: theme.text, fontFamily: fonts.ProximaNova }}
            onPress={() => {
              const data = mnemonics.map((item, index) => {
                return {
                  id: index + 1,
                  word: item,
                };
              });
              navigation.navigate("ConfirmMnemonicScreen", {
                mnemonics: data,
              });
            }}
          />
          <CommonText
            style={{
              fontSize: 16,
              color: "#FFFFFF",
              textAlign: "center",
              paddingHorizontal: 40,
              marginTop: 10,
            }}
          >
            Passcode adds an extra layer of security when using the app
          </CommonText>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: fonts.ProximaNova,
  },
  descText: {
    marginVertical: 10,
    textAlign: "left",
    fontFamily: fonts.ProximaNova,
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
  },
  agreementContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  agreementItem: {
    width: "100%",
    height: 70,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  check: {
    width: 32,
    height: 32,
  },
  mnemonic: {
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    height: 46,
  },
  copy: {
    fontSize: 15,
  },
  copyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  bottomContainer: {
    height: 180,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  warning: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  warningContainer: {
    width: "80%",
    height: 120,
    backgroundColor: "#a4272d",
    padding: 10,
    justifyContent: "center",
    borderRadius: 20,
  },
  warningText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
    fontFamily: fonts.ProximaNova,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
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
