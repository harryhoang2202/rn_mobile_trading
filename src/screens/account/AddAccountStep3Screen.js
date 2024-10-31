import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonBackButton from "@components/commons/CommonBackButton";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import Clipboard from "@react-native-clipboard/clipboard";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function AddAccountStep3Screen({ onCallBack }) {
  const { t } = useTranslation();

  const [mnemonics] = useState(WalletFactory.generateMnemonics());
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const renderMnemonic = (mnemonic, index) => (
    <View key={index.toString()}>
      <View style={styles.mnemonic}>
        <CommonText
          style={{
            textAlign: "left",
            fontWeight: "bold",
            color: theme.text,
            fontFamily: fonts.ProximaNova,
            fontSize: 11,
          }}
        >
          {mnemonic}
        </CommonText>
      </View>
    </View>
  );
  return (
    <View style={[styles.container]}>
      <View style={styles.titleContainer}>
        <CommonText
          style={[
            styles.titleText,
            { color: theme.text, fontWeight: "700", fontFamily: fonts.Nunito },
          ]}
        >
          {t("backup.yourRecoveryPhrase")}
        </CommonText>
      </View>
      <View style={styles.mnemonicContainer}>
        {mnemonics && mnemonics.map(renderMnemonic)}
      </View>
      <CommonText
        style={[
          styles.descText,
          { color: theme.text, fontSize: 10, fontStyle: "italic" },
        ]}
      >
        {t("backup.writeDown")}
      </CommonText>

      <View style={styles.bottomContainer}>
        <CommonGradientButton
          text={t("setting.copy")}
          style={{
            marginVertical: 10,
          }}
          textStyle={{
            color: theme.text2,
            fontSize: 20,
            fontFamily: fonts.ProximaNova,
            fontWeight: "700",
          }}
          onPress={() => {
            const data = mnemonics.map((item, index) => {
              return {
                id: index + 1,
                word: item,
              };
            });
            Clipboard.setString(mnemonics.join(" "));
            alert("opied to clipboard!");
            onCallBack(data);
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
  },
  header: {
    height: 48,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descText: {
    marginVertical: 20,
    textAlign: "center",
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 30,
    borderRadius: 13,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "red",
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
  agreementText: {
    fontSize: 15,
  },
  check: {
    width: 32,
    height: 32,
  },
  mnemonic: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
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
    padding: 10,
    justifyContent: "flex-end",
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
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 40,
    paddingRight: 30,
  },
});
