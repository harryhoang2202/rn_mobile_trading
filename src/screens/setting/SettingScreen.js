import React, { useEffect } from "react";
import {
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import Icon, { Icons } from "@components/icons/Icons";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { applicationProperties } from "@src/application.properties";
import CommonImage from "@components/commons/CommonImage";
import CommonBackButton from "@components/commons/CommonBackButton";
import LinearGradient from "react-native-linear-gradient";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import { fonts } from "@modules/core/constant/AppTextStyle";

function SettingScreen({ onNavigation }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);

  useEffect(() => {
    (async () => {})();
  }, []);
  const ItemSetting = ({ name, icon, onPress }) => {
    return (
      <View style={styles.itemContainer}>
        <CommonTouchableHighlight
          buttonGradientColor={[theme.background6, theme.background6]}
          hightlightGradientColors={theme.gradient11}
          onPress={() => {
            onPress();
            closeAlert();
          }}
          button
          style={{
            height: 92,
            width: 105,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </View>
        </CommonTouchableHighlight>
        <CommonText
          style={{
            color: theme.text,
            fontSize: 16,
            marginTop: 10,
            fontFamily: fonts.Nunito,
            fontWeight: "700",
          }}
        >
          {name}
        </CommonText>
      </View>
    );
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.header]}>
        <View style={[styles.contentHeader]}>
          <CommonText style={[{ color: theme.text }, styles.headerTitle]}>
            Settings
          </CommonText>
        </View>
      </View>
      <View style={styles.row}>
        <ItemSetting
          name={t("settings.wallets")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/wallet.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={() => {
            onNavigation("AccountScreen");
          }}
        />
        <ItemSetting
          name={t("settings.security")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/security.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={() => {
            onNavigation("SecurityScreen");
          }}
        />
        <ItemSetting
          name={t("settings.preferences")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/preferences.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={() => {
            onNavigation("PreferencesScreen");
          }}
        />
      </View>
      <View height={20} />
      <View style={styles.row}>
        <ItemSetting
          name={t("settings.price-alert")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/price-alert.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={() => {
            onNavigation("PriceAlertScreen");
          }}
        />
        <ItemSetting
          name={t("settings.wallet-connect")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/wallet-connect.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={() => {
            onNavigation("WalletConnectScreen");
          }}
        />
        <ItemSetting
          name={t("settings.help_center")}
          icon={
            <CommonImage
              source={require("@assets/images/setting/help-center.png")}
              style={{ width: 52, height: 52 }}
            />
          }
          onPress={async () => {
            await Linking.openURL(applicationProperties.endpoints.helpCenter);
          }}
        />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "70%",
    justifyContent: "center",
  },
  content: {},
  header: {
    height: 55,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: fonts.Nunito,
    fontWeight: "bold",
    marginBottom: 20,
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
  headerBg: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  item: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  itemImage: {
    height: 92,
    width: 105,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: "#27aa7b",
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
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

const show = ({ onNavigation }) => {
  showAlert({
    dismissable: true,
    alertType: "custom",
    customAlert: <SettingScreen onNavigation={onNavigation} />,
  });
};
const SettingAlert = { show };
export default SettingAlert;
