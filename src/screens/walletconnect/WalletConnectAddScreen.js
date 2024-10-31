import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

function WalletConnectAddScreen({ route }) {
  const { onScanSuccess } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const onSuccess = (e) => {
    navigation.goBack();
    onScanSuccess(e.data);
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("scan_wallet_connect")} />
        <View style={{ flex: 1 }}>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.auto}
          />
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
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    height: "100%",
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default WalletConnectAddScreen;
