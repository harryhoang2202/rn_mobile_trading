import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import { applicationProperties } from "@src/application.properties";
import {
  DEFAULT_WALLET,
  WALLET_LIST,
  WALLET_TYPE,
} from "@persistence/wallet/WalletConstant";
import { UserAction } from "@persistence/user/UserAction";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import LinearGradient from "react-native-linear-gradient";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import CommonImage from "@components/commons/CommonImage";
import { FeeAction } from "@persistence/fee/FeeAction";
import { CardAction } from "@persistence/card/CardAction";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function ConfirmMnemonicScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { mnemonics } = route.params;
  const [selectable, setSelectable] = useState(_.shuffle([...mnemonics]));
  const [selected, setSelected] = useState([]);
  const [invalidWord, setInvalidWord] = useState(undefined);
  const [valid, setValid] = useState(undefined);
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const onPressMnemonic = (mnemonic, isSelected) => {
    if (!isSelected) {
      const list1 = selectable.filter((m) => m.id !== mnemonic.id);
      const list2 = selected.concat([mnemonic]);
      setSelectable(list1);
      setSelected(list2);
      isValidSequence(list2);
    } else {
      const list1 = selectable.concat([mnemonic]);
      const list2 = selected.filter((m) => m.id !== mnemonic.id);
      setSelectable(list1);
      setSelected(list2);
      isValidSequence(list2);
    }
  };
  const isValidSequence = (list) => {
    const string1 = list.map((item) => item.word).join("");
    const string2 = mnemonics.map((item) => item.word).join("");
    setInvalidWord(_.startsWith(string2, string1));
    const isValid = _.isEqual(list, mnemonics);
    setValid(isValid);
    return isValid;
  };
  const renderMnemonic = (mnemonic, index) => (
    <CommonTouchableOpacity
      key={index.toString()}
      onPress={() => {
        onPressMnemonic(mnemonic, true);
      }}
    >
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
            color: "#FFFFFF",
            fontFamily: fonts.ProximaNova,
          }}
        >
          {index + 1}. {mnemonic.word}
        </CommonText>
      </LinearGradient>
    </CommonTouchableOpacity>
  );
  const renderSelectable = (mnemonic, index) => (
    <CommonTouchableOpacity
      key={index.toString()}
      onPress={() => {
        onPressMnemonic(mnemonic, false);
      }}
    >
      <LinearGradient
        colors={["#535353", "#41394B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mnemonic}
      >
        <CommonText
          style={{
            textAlign: "left",
            fontWeight: "bold",
            color: "#FFFFFF",
            fontFamily: fonts.ProximaNova,
          }}
        >
          {mnemonic.word}
        </CommonText>
      </LinearGradient>
    </CommonTouchableOpacity>
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
              <CommonText style={[styles.titleText, { color: "#FFFFFF" }]}>
                {t("backup.verifyRecoveryPhrase")}
              </CommonText>
              <CommonText style={[styles.descText, { color: "#FFFFFF" }]}>
                {t("backup.tapTheWord")}
              </CommonText>
            </View>
            <View style={[styles.selectableMnemonicContainer]}>
              <View
                style={[styles.wrapMnemonic, { backgroundColor: "#36096F" }]}
              >
                <View
                  style={{
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingHorizontal: 10,
                  }}
                >
                  {selected.map(renderMnemonic)}
                </View>
                {invalidWord === false && (
                  <CommonText
                    style={{ color: "#FFFFFF", fontFamily: fonts.ProximaNova }}
                  >
                    {t("mnemonic.invalid_order")}
                  </CommonText>
                )}
              </View>
            </View>
            <View style={styles.mnemonicContainer}>
              {selectable.map(renderSelectable)}
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CommonGradientButton
            text={t("continue")}
            disabled={!valid}
            textStyle={{ color: "#FFFFFF", fontFamily: fonts.ProximaNova }}
            onPress={async () => {
              if (valid) {
                const seedPhrase = mnemonics.map((item) => item.word).join(" ");
                CommonLoading.show();
                dispatch(
                  WalletAction.insert({
                    mnemonic: seedPhrase,
                    ...DEFAULT_WALLET,
                  })
                ).then(async ({ data }) => {
                  dispatch(UserAction.signIn()).then(() => {
                    dispatch(FeeAction.getFee());
                    dispatch(CardAction.getCardTypes());
                    dispatch(WalletAction.balance());
                    CommonLoading.hide();
                  });
                });
              }
            }}
          />
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
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 10,
  },
  mnemonic: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
  selectableMnemonicContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    minHeight: 155,
    paddingHorizontal: 30,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  wrapMnemonic: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minHeight: 155,
    paddingVertical: 10,
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
