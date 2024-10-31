import React, { useEffect } from "react";
import { PinCode } from "@components/PinCode";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonLoading from "@components/commons/CommonLoading";
import { UserAction } from "@persistence/user/UserAction";
import CommonImage from "@components/commons/CommonImage";
import { WalletAction } from "@persistence/wallet/WalletAction";
import { CardAction } from "@persistence/card/CardAction";
import { FeeAction } from "@persistence/fee/FeeAction";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

const EnterPinCodeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  useEffect(() => {}, []);

  const success = async () => {
    CommonLoading.show();
    setTimeout(() => {
      dispatch(UserAction.signIn()).then(({ success, data }) => {
        dispatch(FeeAction.getFee());
        dispatch(CardAction.getCardTypes());
        dispatch(WalletAction.balance());
        CommonLoading.hide();
      });
    }, 100);
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          {<CommonAppBar title="" allowBack={false} />}
        </View>
        <PinCode
          onFail={() => {
            console.log("Fail to auth");
          }}
          onSuccess={() => success()}
          onClickButtonLockedPage={() => console.log("Quit")}
          status={"enter"}
          stylePinCodeColorTitle={theme.pincodeTitle}
          stylePinCodeColorButtonNumber={theme.keyboardNumber}
          colorCircleButtons={theme.keyboardContainer}
        />
        <View style={styles.securityTextContainer}>
          <CommonText style={[styles.securityText, { color: theme.text }]}>
            {t("pincode.pass_code_will_add")}
          </CommonText>
        </View>
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
  securityTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  securityText: {
    fontSize: 13,
    textAlign: "center",
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
export default EnterPinCodeScreen;
