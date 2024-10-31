import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { applicationProperties } from "@src/application.properties";
import WebView from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function WalletBuyScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { coin } = route.params;
  const webview = useRef();
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState("");
  const onNavigationStateChange = (webViewState) => {
    setCanGoBack(webViewState.canGoBack);
  };
  useEffect(() => {
    const link =
      applicationProperties.endpoints.ramp +
      "&userAddress=" +
      coin.walletAddress;
    setUrl(link);
  }, []);
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("wallet.buy")} />
        <View style={styles.content}>
          <WebView
            ref={webview}
            source={{
              uri: url,
            }}
            style={{ height: "100%", width: "100%" }}
            originWhitelist={["*"]}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={true}
            showsVerticalScrollIndicator={false}
            onNavigationStateChange={onNavigationStateChange}
            userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
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
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
