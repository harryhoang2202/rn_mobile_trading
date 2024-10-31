import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonBackButton from "@components/commons/CommonBackButton";
import LinearGradient from "react-native-linear-gradient";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import CommonAppBar from "@components/commons/CommonAppBar";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function AddAccountStep4Screen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { mnemonics, account } = route.params;
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
    setInvalidWord(string2.includes(string1));
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
        colors={theme.gradient13}
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
            fontSize: 11,
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
        colors={theme.gradient12}
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
            fontSize: 11,
          }}
        >
          {mnemonic.word}
        </CommonText>
      </LinearGradient>
    </CommonTouchableOpacity>
  );
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("backup.verifyRecoveryPhrase")} />

        <View style={[styles.content]}>
          <View style={styles.titleContainer}>
            <CommonText
              style={[styles.descText, { color: theme.text, fontSize: 14 }]}
            >
              {t("backup.tapTheWord")}
            </CommonText>
          </View>
          <View style={[styles.selectableMnemonicContainer]}>
            <View
              style={[
                styles.wrapMnemonic,
                { backgroundColor: theme.background8 },
              ]}
            >
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {selected.map(renderMnemonic)}
              </View>
              {invalidWord === false && (
                <CommonText style={{ color: theme.text3 }}>
                  {t("mnemonic.invalid_order")}
                </CommonText>
              )}
            </View>
          </View>
          <View style={styles.mnemonicContainer}>
            {selectable.map(renderSelectable)}
          </View>
          <View style={styles.bottomContainer}>
            <CommonGradientButton
              text={t("continue")}
              style={{
                marginVertical: 10,
              }}
              textStyle={{
                color: theme.text2,
                fontSize: 20,
                fontWeight: "700",
                fontFamily: fonts.ProximaNova,
              }}
              onPress={async () => {
                if (valid) {
                  const seedPhrase = mnemonics
                    .map((item) => item.word)
                    .join(" ");
                  CommonLoading.show();
                  dispatch(
                    WalletAction.insert({
                      name: account.name,
                      type: account.type,
                      defaultChain: account.defaultChain,
                      mnemonic: seedPhrase,
                      assets: account.coins,
                      image: account.image,
                      swappable: account.swappable,
                      dapps: account.dapps,
                      chain: account.chain,
                    })
                  ).then(async ({ data }) => {
                    CommonLoading.hide();
                    navigation.pop(3);
                  });
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descText: {
    marginVertical: 10,
    textAlign: "left",
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
    flex: 1,
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectableMnemonicContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 40,
    paddingRight: 30,
  },
});
