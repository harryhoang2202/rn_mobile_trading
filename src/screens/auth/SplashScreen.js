import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CommonImage from "@components/commons/CommonImage";
import i18n from "i18next";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import { useDispatch } from "react-redux";
import { UserAction } from "@persistence/user/UserAction";
import { WalletAction } from "@persistence/wallet/WalletAction";

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const lng = await StorageUtil.getItem("@lng");
      if (lng) {
        await i18n.changeLanguage(lng);
      }
      dispatch(UserAction.get()).then((user) => {
        const nextScreen = user.registered
          ? "EnterPinCodeScreen"
          : "WalkThroughScreen";
        if (user.registered) {
          dispatch(WalletAction.findAll()).then(() => {
            navigation.navigate(nextScreen);
          });
        } else {
          navigation.navigate(nextScreen);
        }
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <CommonImage
        style={{
          height: "100%",
          width: "100%",
          transform: [{ scaleX: 1 }, { scaleY: 1.01 }],
        }}
        source={require("@assets/images/splash/splash.png")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 40,
    letterSpacing: 1,
  },
});
