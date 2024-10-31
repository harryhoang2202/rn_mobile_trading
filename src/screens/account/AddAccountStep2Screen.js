import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, Text } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonButton from "@components/commons/CommonButton";
import { useTranslation } from "react-i18next";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import LinearGradient from "react-native-linear-gradient";
import Icon, { Icons } from "@components/icons/Icons";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonAppBar from "@components/commons/CommonAppBar";
import ActionSheet from "react-native-actions-sheet";
import { useRef } from "react";
import AddAccountStep3Screen from "./AddAccountStep3Screen";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function AddAccountStep2Screen({ navigation, route }) {
  const { t } = useTranslation();
  const { account } = route.params;
  const { theme } = useSelector((state) => state.ThemeReducer);
  const [walletName, setWalletName] = useState("");
  const actionSheetRef = useRef();
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="Wallet" />
        <View style={styles.section}>
          <View style={styles.inputTitle}>
            <CommonText style={{ color: theme.text }}>
              {t("setting.wallet_name")}
            </CommonText>
          </View>
          <View
            style={[styles.inputView, { backgroundColor: theme.container7 }]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  fontWeight: "500",
                  fontSize: 18,
                  fontFamily: "Roboto-Bold",
                },
              ]}
              onChangeText={(text) => setWalletName(text)}
              value={walletName}
              placeholder={t("setting.enter_wallet_name")}
              numberOfLines={1}
              returnKeyType="done"
              placeholderTextColor={theme.subText}
              autoCompleteType={"off"}
              autoCapitalize={"none"}
              autoCorrect={false}
            />
          </View>
        </View>
        <View height={10} />
        <View style={styles.section}>
          <View style={styles.inputTitle}>
            <CommonText style={{ color: theme.text }}>
              Back up options
            </CommonText>
          </View>
          <CommonTouchableOpacity
            onPress={async () => {
              if (walletName.trim() === "") {
                return;
              }
              navigation.navigate("AddAccountStep5Screen", {
                account: {
                  ...account,
                  name: walletName,
                },
              });
            }}
          >
            <View
              style={[
                styles.inputView,
                {
                  backgroundColor: theme.container7,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <CommonText
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    fontWeight: "500",
                    fontSize: 18,
                  },
                ]}
              >
                Show secret phrase
              </CommonText>
              <Icons.AntDesign name="right" size={12} color={theme.icon3} />
            </View>
          </CommonTouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <CommonGradientButton
            text={"Save"}
            textStyle={{
              fontSize: 20,
              fontFamily: fonts.ProximaNova,
              fontWeight: "700",
            }}
            onPress={async () => {
              if (walletName.trim() === "") {
                return;
              }

              actionSheetRef.current?.show();
            }}
          />
          <CommonButton
            style={{
              backgroundColor: theme.backgroundColor,
              height: 34,
            }}
            textStyle={{ color: theme.textHarry }}
            text={"Delete this wallet"}
            onPress={async () => {}}
          />
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            containerStyle={{
              backgroundColor: theme.background8,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
            headerAlwaysVisible
          >
            <AddAccountStep3Screen
              onCallBack={(data) => {
                actionSheetRef.current?.hide();
                navigation.navigate("AddAccountStep4Screen", {
                  mnemonics: data,
                  account,
                });
              }}
            />
          </ActionSheet>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    height: 48,

    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  leftHeader: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  section: {
    width: "100%",

    borderRadius: 10,
    paddingHorizontal: 10,
  },
  item: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputView: {
    height: 34,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: { flex: 1 },
  inputTitle: {
    width: "100%",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonContainer: {
    padding: 10,
    position: "absolute",
    bottom: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
