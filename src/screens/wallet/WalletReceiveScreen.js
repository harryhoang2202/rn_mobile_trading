import React, { useEffect } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";
import Tooltip from "react-native-walkthrough-tooltip";
import Clipboard from "@react-native-clipboard/clipboard";
import Share from "react-native-share";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function WalletReceiveScreen({ navigation, route }) {
  const { coin } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const copyToClipboard = async (data) => {
    await Clipboard.setString(data);
  };
  const shareAddress = async () => {
    await Share.open({
      title: "",
      message: coin.walletAddress,
    });
  };
  useEffect(() => {
    (async () => {})();
  }, []);
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.container]}>
        <CommonAppBar title={`${coin.symbol} ${t("receive.receive")}`} />
        <ScrollView>
          <View style={styles.content}>
            <ImageBackground
              source={{ uri: coin.logoURI }}
              style={{
                height: 100,
                width: 100,
                alignItems: "center",
              }}
            />
            <View height={40} />
            <View style={[styles.qrCode]}>
              <View
                style={{
                  backgroundColor: theme.background5,
                  padding: 10,
                  height: 240,
                  width: 240,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                }}
              >
                <QRCode
                  value={coin.walletAddress}
                  size={200}
                  backgroundColor={theme.background5}
                  logo={{ uri: coin.logoURI }}
                />
              </View>
              <View height={40} />
              <CommonText
                style={{
                  color: theme.text5,
                  marginBottom: 10,
                  fontFamily: fonts.Nunito,
                  fontWeight: "700",
                }}
              >
                Your {coin.symbol} Address
              </CommonText>
              <CommonTouchableOpacity
                style={styles.element}
                onPress={async () => {
                  await copyToClipboard(coin.walletAddress);
                  setTooltipVisible(true);
                  setTimeout(() => {
                    setTooltipVisible(false);
                  }, 1000);
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.hightLight,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 9,
                  }}
                >
                  <CommonText
                    style={{
                      color: theme.text,
                      paddingHorizontal: 36,
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: fonts.Nunito,
                    }}
                    numberOfLines={2}
                  >
                    {coin.walletAddress}
                  </CommonText>
                </View>
              </CommonTouchableOpacity>

              <CommonText
                style={{
                  color: theme.text5,
                  marginTop: 10,
                  fontFamily: fonts.Nunito,
                }}
              >
                Tap {coin.name} Address to copy
              </CommonText>
            </View>

            <View style={styles.controls}>
              <CommonTouchableOpacity
                style={styles.element}
                onPress={async () => {
                  await shareAddress();
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={theme.gradient3}
                  style={{
                    height: 55,
                    width: 180,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                  }}
                >
                  <CommonText
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.Nunito,
                      fontWeight: "700",
                    }}
                  >
                    {t("wallet.receive.share")}
                  </CommonText>
                </LinearGradient>
              </CommonTouchableOpacity>
            </View>
            <ImageBackground
              source={require("@assets/images/img_footer.png")}
              style={{
                height: 30,
                width: 156,
                marginTop: 20,
                alignItems: "center",
              }}
            />
          </View>
        </ScrollView>
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
    alignItems: "center",
    height: "100%",
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
  },
  logoContainer: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  logo: {
    height: 100,
    width: 80,
  },
  qrCode: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  qrCodeHeader: {
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeFooter: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  description: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  controls: {
    height: 100,
    flexDirection: "row",

    flex: 1,
  },
  element: {
    justifyContent: "center",
    alignItems: "center",
  },
  elementIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 100,
  },
});
